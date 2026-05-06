import * as SecureStore from "expo-secure-store";

const PIN_KEY = "user_pin";

export const PinService = {
  savePin: async (pin: string): Promise<void> => {
    await SecureStore.setItemAsync(PIN_KEY, pin);
  },

  getPin: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(PIN_KEY);
  },

  hasPin: async (): Promise<boolean> => {
    const pin = await SecureStore.getItemAsync(PIN_KEY);
    return pin !== null;
  },

  deletePin: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(PIN_KEY);
  },

  verifyPin: async (pin: string): Promise<boolean> => {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    return storedPin === pin;
  },
};
