import { create } from "zustand";

/** Bump after save so Home can refresh saved count. */
export const useDesignsNotifyStore = create<{
  version: number;
  bumpSavedList: () => void;
}>((set) => ({
  version: 0,
  bumpSavedList: () => set((s) => ({ version: s.version + 1 })),
}));
