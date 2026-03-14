export const HAIR_MODEL = "flux-kontext-apps/change-haircut";
export const FACE_SWAP_VERSION = process.env.REPLICATE_FACE_SWAP_VERSION?.trim() || "d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111";
const REPLICATE_API_BASE_URL = process.env.REPLICATE_API_BASE_URL ?? "https://api.replicate.com";
const DEFAULT_HAIR_COLOR = process.env.REPLICATE_DEFAULT_HAIR_COLOR?.trim() || "Black";
const HAIR_MODEL_VERSION = process.env.REPLICATE_HAIR_MODEL_VERSION?.trim() || "";

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
        hairColor: variant.hairColor?.trim() || DEFAULT_HAIR_COLOR
      })
    )
  );
}

/** Starts a single hair prediction without waiting — returns predictionId only. */
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

export async function startFluxKontextProJob(input: {
  imageUrl: string;
  prompt: string;
}): Promise<string> {
  assertReplicateEnv();

  const endpoint = `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/models/black-forest-labs/flux-kontext-pro/predictions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: getReplicateAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt: input.prompt,
        input_image: input.imageUrl,
        aspect_ratio: "match_input_image",
        output_format: "jpg",
        output_quality: 95,
        safety_tolerance: 2,
        prompt_upsampling: false,
      },
    }),
    cache: "no-store",
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate Flux Kontext Pro API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(payload, `Flux Kontext Pro job failed with status ${response.status}.`),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const predictionId = pickString(payload, ["id"]);
  if (!predictionId) {
    throw new ReplicateApiError("Flux Kontext Pro response missing id.", 502);
  }

  return predictionId;
}

/** Starts a face-swap job — user selfie face onto template body. Returns predictionId. */
export async function startFaceSwapJob(input: {
  inputImageUrl: string;  // 템플릿 이미지 (한복 경복궁 등)
  swapImageUrl: string;   // 사용자 셀카 (얼굴 소스) — data URL 또는 HTTPS URL
}): Promise<string> {
  assertReplicateEnv();

  // Replicate face-swap 모델은 HTTPS URL만 지원 — data URL이면 Files API에 먼저 업로드
  let swapUrl = input.swapImageUrl;
  if (swapUrl.startsWith("data:image/")) {
    const decoded = decodeDataUrl(swapUrl);
    swapUrl = await uploadToReplicateFiles(decoded.buffer, decoded.mimeType);
  }

  const endpoint = `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/predictions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: getReplicateAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: FACE_SWAP_VERSION,
      input: {
        input_image: input.inputImageUrl,
        swap_image: swapUrl,
      },
    }),
    cache: "no-store",
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate face-swap API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(payload, `Face-swap job failed with status ${response.status}.`),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const predictionId = pickString(payload, ["id"]);
  if (!predictionId) {
    throw new ReplicateApiError("Face-swap response missing id.", 502);
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
