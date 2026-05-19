import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { PinService } from "../core/services/pin.service";

const AUTH_STORAGE_KEY = "solpay-auth-storage";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  hasPin: boolean;
  isInitialized: boolean;

  save: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
  loadTokens: () => Promise<void>;
  checkPin: (walletAddress: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hasPin: false,
  isInitialized: false,

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
      set({ accessToken: null, refreshToken: null, hasPin: false });
      AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch((error) => {
        console.error("Failed to clear auth tokens:", error);
      });
      // Requirement: Does NOT delete the PIN from secure storage
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
      // Note: We don't check PIN here because we need walletAddress.
      // PIN check will be triggered after wallet connection/reauthorization.
      set({ isInitialized: true });
    } catch (error) {
      console.error("Failed to load auth tokens:", error);
      set({ isInitialized: true });
    }
  },
  checkPin: async (walletAddress: string) => {
    const hasPin = await PinService.hasPin(walletAddress);
    set({ hasPin });
  },
}));
