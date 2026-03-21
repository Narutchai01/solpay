import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const AUTH_STORAGE_KEY = "solpay-auth-storage";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;

  save: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
  loadTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,

  save: (accessToken: string, refreshToken: string) => {
    try {
      set({ accessToken, refreshToken });
      const authData = { accessToken, refreshToken };
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData)).catch(
        (error) => {
          console.error("Failed to save auth tokens:", error);
        },
      );
    } catch (error) {
      console.error("Failed to save auth tokens:", error);
    }
  },

  clear: () => {
    try {
      set({ accessToken: null, refreshToken: null });
      AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch((error) => {
        console.error("Failed to clear auth tokens:", error);
      });
    } catch (error) {
      console.error("Failed to clear auth tokens:", error);
    }
  },
  loadTokens: async () => {
    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (authData) {
        const { accessToken, refreshToken } = JSON.parse(authData);
        set({ accessToken, refreshToken });
      }
    } catch (error) {
      console.error("Failed to load auth tokens:", error);
    }
  },
}));
