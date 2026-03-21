import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;

  save: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,

      save: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clear: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "solpay-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
