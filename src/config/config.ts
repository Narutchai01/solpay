import { Platform } from "react-native";

const fallbackApiUrl = "https://2xqkwr2l-8080.asse.devtunnels.ms/";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() || fallbackApiUrl;
