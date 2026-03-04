export const HAIR_MODEL = "black-forest-labs/flux-kontext-pro";

export type StartHairJobInput = {
  photoDataUrl: string;
  prompt: string;
};

export async function startHairVariantJobs(input: StartHairJobInput): Promise<string[]> {
  void input;

  throw new Error(
    "Replicate integration is not wired yet. Implement the provider call with input_image."
  );
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

export async function pollPredictions(predictionIds: string[]): Promise<unknown[]> {
  void predictionIds;

  throw new Error("Prediction polling is not wired yet.");
}

