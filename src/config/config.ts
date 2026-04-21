import { Platform } from "react-native";

const fallbackApiUrl =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() || fallbackApiUrl;
