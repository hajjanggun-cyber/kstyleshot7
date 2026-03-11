export type Locale = "en" | "ko";

export type JobStatus =
  | "payment_pending"
  | "payment_confirmed"
  | "upload_pending"
  | "hair_selecting"
  | "hair_processing"
  | "hair_completed"
  | "outfit_selecting"
  | "outfit_processing"
  | "outfit_completed"
  | "final_processing"
  | "cutout_processing"   // legacy — kept for backward compat
  | "cutout_completed"    // legacy
  | "location_selecting"  // legacy
  | "composite_completed" // legacy
  | "completed"
  | "failed"
  | "refunded";

export type Step = "hair" | "outfit";

export type StepResult = {
  id: string;
  blobUrl: string;
  downloaded: boolean;
  selected: boolean;
};

export type SelectionState = {
  chosen: string[];
  results: StepResult[];
  picked: string | null;
};

export type CreateSessionState = {
  orderId: string;
  checkoutId: string;
  sessionToken: string;
  status: JobStatus;
  photoBlobUrl: string | null;
  hair: SelectionState;
  outfit: SelectionState;
};

export type HairCategory = "daily" | "performance" | "trendy" | "special" | "premium";

export type HairStyle = {
  id: string;
  name: string;
  haircut: string;
  thumbnail: string;
  tags: string[];
  category: HairCategory;
  colorHint?: string;
};

export type ClothType = "upper" | "lower" | "overall" | "inner" | "outer";

export type Outfit = {
  id: string;
  name: string;
  thumbnail: string;
  garmentImage: string;
  description: string;
  tags: string[];
  category?: "stage" | "street" | "award";
  colorHint?: string;
  clothType?: ClothType;
};

export type Background = {
  id: string;
  name: string;
  thumbUrl: string;
  fullUrl: string;
  mood: string;
  colorHint?: string;
  label?: string;
};

export type KVJob = {
  orderId: string;
  checkoutId: string;
  sessionToken: string;
  status: JobStatus;
  currentStep: Step | null;
  selectedStyles: {
    hair: string[];
    outfit: string[];
    location: string[];
  };
  pickedStyles: {
    hair: string | null;
    outfit: string | null;
    location: string | null;
  };
  generatedResults: {
    hair: Array<{ id: string; imageUrl: string }>;
    outfit: Array<{ id: string; imageUrl: string }>;
    cutout: Array<{ id: string; imageUrl: string }>;
    location: Array<{ id: string; imageUrl: string }>;
  };
  predictionIds: {
    hair: string[];
    outfit: string[];
    cutout: string[];
  };
  attempts: {
    hair: number;
    outfit: number;
    cutout: number;
  };
  failReason: string | null;
  refundRequested: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};

export type SessionStatusResponse =
  | {
      ready: false;
      status: "pending";
    }
  | {
      ready: true;
      status: JobStatus;
      orderId: string;
      sessionToken: string;
    };
