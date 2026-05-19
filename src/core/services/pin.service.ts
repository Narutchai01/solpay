import * as SecureStore from "expo-secure-store";

const getPinKey = (walletAddress: string) => `pin_${walletAddress}`;

export const PinService = {
  savePin: async (walletAddress: string, pin: string): Promise<void> => {
    await SecureStore.setItemAsync(getPinKey(walletAddress), pin);
  },

  getPin: async (walletAddress: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(getPinKey(walletAddress));
  },

  hasPin: async (walletAddress: string): Promise<boolean> => {
    const pin = await SecureStore.getItemAsync(getPinKey(walletAddress));
    return pin !== null;
  },

  deletePin: async (walletAddress: string): Promise<void> => {
    await SecureStore.deleteItemAsync(getPinKey(walletAddress));
  },

  verifyPin: async (walletAddress: string, pin: string): Promise<boolean> => {
    const storedPin = await SecureStore.getItemAsync(getPinKey(walletAddress));
    return storedPin === pin;
  },
};
