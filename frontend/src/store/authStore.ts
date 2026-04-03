import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userName: string | null;
  /** False until AsyncStorage rehydration finishes — avoid showing "logged out" UI with stale null token. */
  hasHydrated: boolean;
  setSession: (token: string, userName: string | null) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      hasHydrated: false,
      setSession: (token, userName) => set({ token, userName }),
      clearSession: () => set({ token: null, userName: null }),
    }),
    {
      name: "roomplanner-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    }
  )
);
