export const HAIR_MODEL = "flux-kontext-apps/change-haircut";
const REPLICATE_API_BASE_URL = process.env.REPLICATE_API_BASE_URL ?? "https://api.replicate.com";
const DEFAULT_HAIR_COLOR = process.env.REPLICATE_DEFAULT_HAIR_COLOR?.trim() || "No change";
const HAIR_MODEL_VERSION = process.env.REPLICATE_HAIR_MODEL_VERSION?.trim() || "";
const DEFAULT_HAIR_GENDER = "female";
const DEFAULT_HAIR_ASPECT_RATIO = "4:5";
const DEFAULT_HAIR_OUTPUT_FORMAT = "jpg";
const DEFAULT_HAIR_SAFETY_TOLERANCE = 2;
const DEFAULT_HAIR_SEED = 42;

type JsonRecord = Record<string, unknown>;

type DecodedDataUrl = {
  mimeType: string;
  buffer: Buffer;
  base64: string;
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pickString(value: unknown, keys: string[]): string | null {
  if (!isRecord(value)) {
    return null;
  }

  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

function normalizePredictionStatus(value: unknown): ReplicatePrediction["status"] {
  if (value === "succeeded" || value === "failed" || value === "canceled") {
    return value;
  }

  return "processing";
}

function extractOutputUrl(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      if (typeof item === "string" && item.trim()) {
        return item.trim();
      }

      if (isRecord(item)) {
        const fromUrlField = pickString(item, ["url", "href"]);
        if (fromUrlField) {
          return fromUrlField;
        }
      }
    }
  }

  if (isRecord(payload)) {
    return pickString(payload, ["url", "href"]);
  }

  return null;
}

function decodeDataUrl(dataUrl: string): DecodedDataUrl {
  const match = dataUrl.match(/^data:([^;,]+);base64,(.+)$/);
  if (!match) {
    throw new ReplicateApiError("Invalid image data URL format.", 400);
  }

  const [, mimeType, base64] = match;

  try {
    return {
      mimeType,
      buffer: Buffer.from(base64, "base64"),
      base64,
    };
  } catch {
    throw new ReplicateApiError("Unable to decode image data URL.", 400);
  }
}

function toReplicateDataUri(decoded: DecodedDataUrl): string {
  return `data:${decoded.mimeType};base64,${decoded.base64}`;
}

function assertReplicateEnv(): void {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new ReplicateApiError(
      "Missing required Replicate environment variable: REPLICATE_API_TOKEN.",
      500
    );
  }
}

function getReplicateAuthHeader(): string {
  const token = process.env.REPLICATE_API_TOKEN?.trim();
  if (!token) {
    throw new ReplicateApiError(
      "Missing required Replicate environment variable: REPLICATE_API_TOKEN.",
      500
    );
  }

  return `Bearer ${token}`;
}

function extractApiErrorMessage(payload: unknown, fallback: string): string {
  const direct = pickString(payload, ["detail", "error", "message", "title"]);
  if (direct) {
    return direct;
  }

  if (isRecord(payload)) {
    const errors = payload.errors;
    if (Array.isArray(errors)) {
      const first = errors.find((item) => typeof item === "string");
      if (typeof first === "string" && first.trim()) {
        return first.trim();
      }
    }
  }

  return fallback;
}

async function parseApiJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ReplicateApiError("Replicate returned a non-JSON response.", 502);
  }
}

function getHairPredictionEndpoint(): string {
  const [owner, model] = HAIR_MODEL.split("/");
  if (!owner || !model) {
    throw new ReplicateApiError(`Invalid HAIR_MODEL format: ${HAIR_MODEL}`, 500);
  }

  if (HAIR_MODEL_VERSION) {
    return `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/models/${owner}/${model}/versions/${HAIR_MODEL_VERSION}/predictions`;
  }

  return `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/models/${owner}/${model}/predictions`;
}

async function startPrediction(input: {
  inputImage: string;
  haircut: string;
  hairColor: string;
  gender?: string;
  aspectRatio?: string;
  outputFormat?: string;
  safetyTolerance?: number;
  seed?: number;
  wait?: boolean;
}): Promise<{ predictionId: string; outputUrl: string | null }> {
  const endpoint = getHairPredictionEndpoint();
  const headers: Record<string, string> = {
    Authorization: getReplicateAuthHeader(),
    "Content-Type": "application/json",
  };
  if (input.wait !== false) {
    headers["Prefer"] = "wait";
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      input: {
        haircut: input.haircut,
        hair_color: input.hairColor,
        gender: input.gender || DEFAULT_HAIR_GENDER,
        aspect_ratio: input.aspectRatio || DEFAULT_HAIR_ASPECT_RATIO,
        output_format: input.outputFormat || DEFAULT_HAIR_OUTPUT_FORMAT,
        safety_tolerance: input.safetyTolerance ?? DEFAULT_HAIR_SAFETY_TOLERANCE,
        seed: input.seed ?? DEFAULT_HAIR_SEED,
        input_image: input.inputImage,
      },
    }),
    cache: "no-store"
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate prediction API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(
        payload,
        `Replicate prediction start failed with status ${response.status}.`
      ),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const predictionId = pickString(payload, ["id"]);
  if (!predictionId) {
    throw new ReplicateApiError("Replicate prediction response is missing an id.", 502);
  }

  // Prefer: wait — output may already be in the response if generation completed in time
  const outputUrl = extractOutputUrl(isRecord(payload) ? payload.output : null);

  return { predictionId, outputUrl };
}

async function getPrediction(predictionId: string): Promise<ReplicatePrediction> {
  const endpoint = `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/predictions/${predictionId}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: getReplicateAuthHeader()
    },
    cache: "no-store"
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate prediction status API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(
        payload,
        `Replicate prediction status failed with status ${response.status}.`
      ),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const id = pickString(payload, ["id"]) ?? predictionId;
  const status = normalizePredictionStatus(isRecord(payload) ? payload.status : null);
  const outputUrl = extractOutputUrl(isRecord(payload) ? payload.output : null);
  const error = pickString(payload, ["error", "detail", "message"]);

  return { id, status, outputUrl, error };
}

export class ReplicateApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ReplicateApiError";
    this.status = status;
  }
}

export type HairVariantInput = {
  id: string;
  haircut: string;
  hairColor?: string;
};

export type HairVariantResult = {
  predictionId: string;
  outputUrl: string | null;
};

export type StartHairJobInput = {
  photoDataUrl: string;
  variants: HairVariantInput[];
};

export type ReplicatePrediction = {
  id: string;
  status: "processing" | "succeeded" | "failed" | "canceled";
  outputUrl: string | null;
  error: string | null;
};

export async function startHairVariantJobs(input: StartHairJobInput): Promise<HairVariantResult[]> {
  assertReplicateEnv();

  if (!input.photoDataUrl.startsWith("data:image/")) {
    throw new ReplicateApiError(
      "photoDataUrl must be an image data URL before calling Replicate.",
      400
    );
  }

  if (input.variants.length < 1 || input.variants.length > 2) {
    throw new ReplicateApiError("One or two hair variants are required.", 400);
  }

  if (input.variants.some((variant) => !variant.haircut.trim())) {
    throw new ReplicateApiError("Each hair variant must include a non-empty haircut.", 400);
  }

  return Promise.all(
    input.variants.map((variant) =>
      startPrediction({
        inputImage: input.photoDataUrl,
        haircut: variant.haircut.trim(),
        hairColor: variant.hairColor?.trim() || DEFAULT_HAIR_COLOR,
      })
    )
  );
}


export async function startHairPreviewJob(input: {
  photoDataUrl: string;
  haircutName: string;
  hairColor: string;
}): Promise<string> {
  assertReplicateEnv();

  if (!input.photoDataUrl.startsWith("data:image/")) {
    throw new ReplicateApiError("photoDataUrl must be an image data URL.", 400);
  }

  const decodedImage = decodeDataUrl(input.photoDataUrl);
  const replicateInputImage =
    decodedImage.buffer.byteLength < 1024 * 1024
      ? toReplicateDataUri(decodedImage)
      : await uploadToReplicateFiles(decodedImage.buffer, decodedImage.mimeType);

  const { predictionId } = await startPrediction({
    inputImage: replicateInputImage,
    haircut: input.haircutName,
    hairColor: input.hairColor || DEFAULT_HAIR_COLOR,
    wait: false,
  });

  return predictionId;
}



export { getPrediction };

/** Uploads an image buffer to Replicate Files API — returns a CDN URL */
export async function uploadToReplicateFiles(buffer: Buffer, mimeType: string): Promise<string> {
  assertReplicateEnv();

  const form = new FormData();
  const extension = mimeType.split("/")[1] || "bin";
  form.append("content", new Blob([new Uint8Array(buffer)], { type: mimeType }), `input_image.${extension}`);

  const response = await fetch(`${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/files`, {
    method: "POST",
    headers: { Authorization: getReplicateAuthHeader() },
    body: form,
    cache: "no-store",
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate Files API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(payload, `File upload failed with status ${response.status}.`),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const urls = isRecord(payload) ? payload.urls : null;
  const url = isRecord(urls) ? pickString(urls, ["get"]) : null;
  if (!url) throw new ReplicateApiError("File upload response missing URL.", 502);

  return url;
}


const NANO_BANANA_PROMPT_TEMPLATE = (sceneDescription: string) => `Create a photorealistic image by combining three input images.

CRITICAL RULES
The face from Image 1 must remain unchanged.
Preserve the exact facial structure, eye shape, nose, mouth, and identity from Image 1.
Maintain near-perfect facial similarity to Image 1.
Do not alter facial geometry or identity in any way.

The person must be naturally integrated into the environment from Image 3.
Match lighting direction, perspective, shadows, color temperature, and environmental reflections so the subject appears physically present in the scene.
The result must look like a real photograph taken in that location.

IMAGE ROLES
Image 1: identity reference (the person). This image defines the face and identity.
Image 2: clothing reference. Apply this outfit to the person.
Image 3: environment reference. Use this as the background and location.

COMPOSITION
Place the person naturally inside the environment from Image 3.

OUTFIT
Apply the clothing from Image 2 onto the person while keeping body proportions realistic and natural.

POSE
The subject is taking a selfie using a smartphone.
One arm is extended slightly toward the camera holding the phone.

The back side of the smartphone is facing the viewer.
The smartphone screen is facing the subject.

The rear of the phone is visible in the image.
The front screen of the phone must not be visible.

The smartphone is partially visible inside the frame near the edge of the image like a natural selfie photo.

CAMERA
The viewer camera is the smartphone the subject is holding.
This image is captured from the perspective of the smartphone selfie camera.
Camera angle slightly above eye level.
Natural handheld framing typical of a selfie photograph.

GAZE
The subject is looking directly into the smartphone camera lens while taking the selfie.
Clear eye contact with the phone camera.
The subject's gaze follows the smartphone camera position.

REALISM
Photorealistic skin texture.
Natural environmental lighting interaction.
Accurate shadow casting on the ground and surrounding surfaces.
Correct depth of field and perspective.

SCENE DESCRIPTION
${sceneDescription}

CONSTRAINTS
Do not change the person's identity.
Do not stylize, cartoonize, or exaggerate features.
Do not paste or collage the subject onto the background.
The subject must appear naturally integrated into the environment.

QUALITY
Ultra realistic photography
Sharp focus
Natural lighting
Cinematic depth of field
High detail`;

/** Starts a nano-banana-pro job combining a hair-styled selfie, outfit image, and background scene. Returns predictionId. */
export async function startNanaBananaJob(input: {
  hairPreviewUrl: string;    // image 1: hair-styled selfie (HTTPS URL)
  outfitImageUrl: string;    // image 2: outfit/costume (HTTPS URL)
  backgroundImageUrl: string; // image 3: background scene (HTTPS URL)
  sceneDescription?: string; // optional scene-specific context appended to base prompt
}): Promise<string> {
  assertReplicateEnv();

  const prompt = NANO_BANANA_PROMPT_TEMPLATE(
    input.sceneDescription ?? "The scene is a stylish and atmospheric K-pop photoshoot location with professional lighting."
  );

  const endpoint = `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/models/google/nano-banana-pro/predictions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: getReplicateAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt,
        image_input: [input.hairPreviewUrl, input.outfitImageUrl, input.backgroundImageUrl],
        aspect_ratio: "4:5",
        resolution: "2K",
        output_format: "jpg",
        safety_filter_level: "block_only_high",
      },
    }),
    cache: "no-store",
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate nano-banana-pro API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(payload, `nano-banana-pro job failed with status ${response.status}.`),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const predictionId = pickString(payload, ["id"]);
  if (!predictionId) {
    throw new ReplicateApiError("nano-banana-pro response missing id.", 502);
  }

  return predictionId;
}

export async function pollPredictions(predictionIds: string[]): Promise<ReplicatePrediction[]> {
  assertReplicateEnv();

  if (predictionIds.length === 0) {
    return [];
  }

  return Promise.all(predictionIds.map((predictionId) => getPrediction(predictionId)));
}
