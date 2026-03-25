import { create } from "zustand";

type AppState = {
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  hydrated: false,
  setHydrated: (value) => set({ hydrated: value })
}));

