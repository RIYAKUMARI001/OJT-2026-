const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const env = {
  apiBaseUrl
} as const;

