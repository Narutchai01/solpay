import { Platform } from "react-native";

const fallbackApiUrl = "https://core-service.solpay.narutchai.com";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() || fallbackApiUrl;
