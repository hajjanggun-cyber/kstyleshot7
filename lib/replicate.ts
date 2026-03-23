export const HAIR_MODEL = "flux-kontext-apps/change-haircut";
const REPLICATE_API_BASE_URL = process.env.REPLICATE_API_BASE_URL ?? "https://api.replicate.com";
const DEFAULT_HAIR_COLOR = process.env.REPLICATE_DEFAULT_HAIR_COLOR?.trim() || "No change";
const HAIR_MODEL_VERSION = process.env.REPLICATE_HAIR_MODEL_VERSION?.trim() || "";
const DEFAULT_HAIR_GENDER = "none";
const DEFAULT_HAIR_ASPECT_RATIO = "4:5";
const DEFAULT_HAIR_OUTPUT_FORMAT = "png";
const DEFAULT_HAIR_SAFETY_TOLERANCE = 2;

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

  const decodedImage = decodeDataUrl(input.photoDataUrl);
  const replicateInputImage = await uploadToReplicateFiles(decodedImage.buffer, decodedImage.mimeType);

  return Promise.all(
    input.variants.map((variant) =>
      startPrediction({
        inputImage: replicateInputImage,
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
  const replicateInputImage = await uploadToReplicateFiles(decodedImage.buffer, decodedImage.mimeType);

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


const NANO_BANANA_PROMPT_TEMPLATE = (sceneDescription: string) => `The first image shows a person with a specific face and hairstyle.
The second image shows a K-pop outfit or costume.
The third image shows a background scene and location.

### [CRITICAL PRIORITY: 100% IDENTITY MATCH - ABSOLUTE]
- The goal is NOT to create a new character or a stylized idol version.
- Copy and Paste the exact face from the first reference image.
- Strictly maintain the EXACT facial structure, eye shape, eyelid lines, nose bridge width, and lip contours of the person in the first image, including all micro-asymmetry and unique facial details.
- DO NOT beautify, DO NOT apply any style-specific makeup, and DO NOT smooth the skin texture.
- Retain the natural skin tone, pores, and fine lines precisely as they appear in the original photo.
- The person's face must be 1:1 identical to the original reference, with no distortion, morphing, or generalization.

[COMPOSITION & STYLE]
- Place the person from the first image into the location from the third image.
- Dress the person in the outfit shown in the second image.
- Show the full body from head to shoes, standing naturally in the center of the frame.
- The composition is a professional fashion editorial shot with a 35mm lens perspective.

[SEAMLESS OPTICAL INTEGRATION - DEEP FOCUS MODE]
- Match the lighting, color temperature, and atmospheric shadows of the third image exactly.
- Apply "Global Illumination": The specific color temperature from the background must naturally wrap around the subject's body.
- Create "Contact Shadows": Generate realistic, precise ambient occlusion shadows precisely under the soles of the shoes where they contact the pavement to ensure the subject is firmly grounded.
- Match "Image Grain": Synchronize the digital noise and film grain between the subject and the background for a unified texture.
- Use a F8.0 or higher aperture setting for deep depth of field: Ensure both the subject and the background are in focus, with only a very subtle, natural fall-off in the furthest distance.
- Align the sharpness level of the subject with the resolution and texture details of the background.

[SCENE DESCRIPTION]
${sceneDescription}

[FINAL OUTPUT QUALITY]
The result must be a flawless, photorealistic photoshoot. Treat the first image as an unchangeable master reference for the face. The priority is the exact 1:1 reproduction of the person's face from the reference image, seamlessly blended into the background with realistic grounding shadows and consistent deep-focus optics.`;

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
