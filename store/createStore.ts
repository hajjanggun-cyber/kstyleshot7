"use client";

import { create } from "zustand";

import type { CreateSessionState, JobStatus, StepResult } from "@/types";

type CreateActions = {
  setCheckout: (checkoutId: string) => void;
  setSession: (input: { orderId: string; sessionToken: string; status: JobStatus }) => void;
  setStatus: (status: JobStatus) => void;
  setPhotoBlobUrl: (blobUrl: string | null) => void;
  setPhotoDataUrl: (dataUrl: string | null) => void;
  setHairChosen: (ids: string[]) => void;
  setHairColor: (color: string) => void;
  setHairPreviewUrl: (url: string | null) => void;
  setHairPredictionId: (id: string | null) => void;
  setHairResults: (results: StepResult[]) => void;
  pickHair: (id: string) => void;
  setOutfitChosen: (ids: string[]) => void;
  pickOutfit: (id: string) => void;
  setBackgroundId: (id: string | null) => void;
  setFinalImageUrl: (url: string | null) => void;
  setFinalPredictionId: (id: string | null) => void;
  reset: () => void;
};

function createEmptySelection() {
  return {
    chosen: [],
    results: [],
    picked: null
  };
}

const initialState: CreateSessionState = {
  orderId: "",
  checkoutId: "",
  sessionToken: "",
  status: "payment_pending",
  photoBlobUrl: null,
  photoDataUrl: null,
  hair: createEmptySelection(),
  outfit: createEmptySelection(),
};

export const useCreateStore = create<
  CreateSessionState & {
    hairColor: string | null;
    hairPreviewUrl: string | null;
    hairPredictionId: string | null;
    backgroundId: string | null;
    finalImageUrl: string | null;
    finalPredictionId: string | null;
  } & CreateActions
>((set) => ({
  ...initialState,
  hairColor: null,
  hairPreviewUrl: null,
  hairPredictionId: null,
  backgroundId: null,
  finalImageUrl: null,
  finalPredictionId: null,
  setCheckout: (checkoutId) => set({ checkoutId }),
  setSession: ({ orderId, sessionToken, status }) => set({ orderId, sessionToken, status }),
  setStatus: (status) => set({ status }),
  setPhotoBlobUrl: (photoBlobUrl) => set({ photoBlobUrl }),
  setPhotoDataUrl: (photoDataUrl) => set({ photoDataUrl }),
  setHairChosen: (ids) =>
    set(() => ({
      hair: { ...createEmptySelection(), chosen: ids.slice(0, 2) },
      status: "hair_selecting"
    })),
  setHairColor: (color) => set({ hairColor: color }),
  setHairPreviewUrl: (url) => set({ hairPreviewUrl: url }),
  setHairPredictionId: (id) => set({ hairPredictionId: id }),
  setHairResults: (results) =>
    set((state) => ({
      hair: { ...state.hair, results },
      status: "hair_completed"
    })),
  pickHair: (id) =>
    set((state) => ({
      hair: { ...state.hair, picked: id },
      status: "outfit_selecting"
    })),
  setOutfitChosen: (ids) =>
    set(() => ({
      outfit: { ...createEmptySelection(), chosen: ids.slice(0, 1) },
      status: "outfit_selecting"
    })),
  pickOutfit: (id) =>
    set((state) => ({
      outfit: { ...state.outfit, picked: id },
      status: "final_processing"
    })),
  setBackgroundId: (id) => set({ backgroundId: id }),
  setFinalImageUrl: (url) => set({ finalImageUrl: url }),
  setFinalPredictionId: (id) => set({ finalPredictionId: id }),
  reset: () =>
    set({
      ...initialState,
      hair: createEmptySelection(),
      outfit: createEmptySelection(),
      hairColor: null,
      hairPreviewUrl: null,
      hairPredictionId: null,
      backgroundId: null,
      finalImageUrl: null,
      finalPredictionId: null,
    })
}));
