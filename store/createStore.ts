"use client";

import { create } from "zustand";

import type { CreateSessionState, JobStatus, StepResult } from "@/types";

type CreateActions = {
  setCheckout: (checkoutId: string) => void;
  setSession: (input: { orderId: string; sessionToken: string; status: JobStatus }) => void;
  setStatus: (status: JobStatus) => void;
  setPhotoBlobUrl: (blobUrl: string | null) => void;
  setHairChosen: (ids: string[]) => void;
  setHairColor: (color: string) => void;
  setHairResults: (results: StepResult[]) => void;
  pickHair: (id: string) => void;
  setOutfitChosen: (ids: string[]) => void;
  setOutfitResults: (results: StepResult[]) => void;
  pickOutfit: (id: string) => void;
  setLocationChosen: (ids: string[]) => void;
  setLocationResults: (results: StepResult[]) => void;
  pickLocation: (id: string) => void;
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
  hair: createEmptySelection(),
  outfit: createEmptySelection(),
  location: createEmptySelection()
};

export const useCreateStore = create<CreateSessionState & { hairColor: string | null } & CreateActions>((set) => ({
  ...initialState,
  hairColor: null,
  setCheckout: (checkoutId) => set({ checkoutId }),
  setSession: ({ orderId, sessionToken, status }) => set({ orderId, sessionToken, status }),
  setStatus: (status) => set({ status }),
  setPhotoBlobUrl: (photoBlobUrl) => set({ photoBlobUrl }),
  setHairChosen: (ids) =>
    set((state) => ({
      hair: { ...createEmptySelection(), chosen: ids.slice(0, 2) },
      status: "hair_selecting"
    })),
  setHairColor: (color) => set({ hairColor: color }),
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
    set((state) => ({
      outfit: { ...createEmptySelection(), chosen: ids.slice(0, 2) },
      status: "outfit_selecting"
    })),
  setOutfitResults: (results) =>
    set((state) => ({
      outfit: { ...state.outfit, results },
      status: "outfit_completed"
    })),
  pickOutfit: (id) =>
    set((state) => ({
      outfit: { ...state.outfit, picked: id },
      status: "cutout_processing"
    })),
  setLocationChosen: (ids) =>
    set((state) => ({
      location: { ...createEmptySelection(), chosen: ids.slice(0, 2) },
      status: "location_selecting"
    })),
  setLocationResults: (results) =>
    set((state) => ({
      location: { ...state.location, results },
      status: "composite_completed"
    })),
  pickLocation: (id) =>
    set((state) => ({
      location: { ...state.location, picked: id },
      status: "completed"
    })),
  reset: () =>
    set({
      ...initialState,
      hair: createEmptySelection(),
      outfit: createEmptySelection(),
      location: createEmptySelection()
    })
}));
