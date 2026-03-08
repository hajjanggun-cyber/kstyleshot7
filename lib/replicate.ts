export const HAIR_MODEL = "flux-kontext-apps/change-haircut";
const REPLICATE_API_BASE_URL = process.env.REPLICATE_API_BASE_URL ?? "https://api.replicate.com";
const DEFAULT_HAIR_COLOR = process.env.REPLICATE_DEFAULT_HAIR_COLOR?.trim() || "Black";

type JsonRecord = Record<string, unknown>;

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

  return `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/models/${owner}/${model}/predictions`;
}

async function startPrediction(input: {
  photoDataUrl: string;
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
        input_image: input.photoDataUrl,
        prompt: "change only the hair, keep the face identical, do not alter facial features"
      }
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
        photoDataUrl: input.photoDataUrl,
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

  const { predictionId } = await startPrediction({
    photoDataUrl: input.photoDataUrl,
    haircut: input.haircutName,
    hairColor: input.hairColor || DEFAULT_HAIR_COLOR,
    wait: false,
  });

  return predictionId;
}

const OUTFIT_MODEL_VERSION =
  "cf5cb07a25e726fe2fac166a8c5ab52ddccd48657741670fb09d9954d4d8446f";

/** Starts an outfit try-on prediction without waiting — returns predictionId. */
export async function startOutfitTryOnJob(input: {
  photoDataUrl: string;
  garmentImageUrl: string;
}): Promise<string> {
  assertReplicateEnv();

  if (!input.photoDataUrl.startsWith("data:image/")) {
    throw new ReplicateApiError("photoDataUrl must be an image data URL.", 400);
  }

  const endpoint = `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/predictions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: getReplicateAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: OUTFIT_MODEL_VERSION,
      input: {
        person_image: input.photoDataUrl,
        cloth_image: input.garmentImageUrl,
        output_format: "png",
        output_quality: 100,
      },
    }),
    cache: "no-store",
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate prediction API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(
        payload,
        `Replicate outfit try-on failed with status ${response.status}.`
      ),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const predictionId = pickString(payload, ["id"]);
  if (!predictionId) {
    throw new ReplicateApiError("Replicate prediction response is missing an id.", 502);
  }

  return predictionId;
}

const BG_REMOVER_VERSION =
  "a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc";

/** Starts a background removal prediction — returns predictionId. */
export async function startBgRemovalJob(imageUrl: string): Promise<string> {
  assertReplicateEnv();

  const endpoint = `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/predictions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: getReplicateAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: BG_REMOVER_VERSION,
      input: {
        image: imageUrl,
        format: "png",
        reverse: false,
        threshold: 0,
        background_type: "rgba",
      },
    }),
    cache: "no-store",
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate BG removal API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(payload, `BG removal failed with status ${response.status}.`),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const predictionId = pickString(payload, ["id"]);
  if (!predictionId) {
    throw new ReplicateApiError("BG removal response missing id.", 502);
  }

  return predictionId;
}

export async function startOutfitVariantJobs(): Promise<string[]> {
  throw new Error(
    "Outfit generation is blocked until a commercially permitted provider is selected."
  );
}

export async function startCutoutJob(): Promise<string[]> {
  throw new Error(
    "Cutout generation is not wired yet. Add a commercially permitted background removal provider."
  );
}

export { getPrediction };

/** Uploads an image buffer to Replicate Files API — returns a CDN URL */
export async function uploadToReplicateFiles(buffer: Buffer, mimeType: string): Promise<string> {
  assertReplicateEnv();

  const form = new FormData();
  form.append("content", new Blob([new Uint8Array(buffer)], { type: mimeType }), "composite.jpg");

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

/** Starts a flux-kontext-dev prediction — returns predictionId */
export async function startFluxKontextJob(imageUrl: string, prompt: string): Promise<string> {
  assertReplicateEnv();

  const endpoint = `${REPLICATE_API_BASE_URL.replace(/\/$/, "")}/v1/models/black-forest-labs/flux-kontext-dev/predictions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: getReplicateAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt,
        input_image: imageUrl,
        output_format: "jpg",
        num_inference_steps: 28,
      },
    }),
    cache: "no-store",
  }).catch(() => {
    throw new ReplicateApiError("Unable to reach Replicate Flux Kontext API.", 502);
  });

  const payload = await parseApiJson(response);
  if (!response.ok) {
    throw new ReplicateApiError(
      extractApiErrorMessage(payload, `Flux Kontext job failed with status ${response.status}.`),
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const predictionId = pickString(payload, ["id"]);
  if (!predictionId) throw new ReplicateApiError("Flux Kontext response missing id.", 502);

  return predictionId;
}

export async function pollPredictions(predictionIds: string[]): Promise<ReplicatePrediction[]> {
  assertReplicateEnv();

  if (predictionIds.length === 0) {
    return [];
  }

  return Promise.all(predictionIds.map((predictionId) => getPrediction(predictionId)));
}
