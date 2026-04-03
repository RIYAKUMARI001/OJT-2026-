import Constants from "expo-constants";
import { Platform } from "react-native";

function hostFromExpo(): string | undefined {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host) return host;
  }

  const legacy = (
    Constants as unknown as { manifest?: { debuggerHost?: string } }
  ).manifest?.debuggerHost;
  if (legacy) {
    const host = legacy.split(":")[0];
    if (host) return host;
  }

  const m2 = Constants.manifest2 as
    | { extra?: { expoClient?: { hostUri?: string } } }
    | undefined;
  const uri2 = m2?.extra?.expoClient?.hostUri;
  if (uri2) {
    const host = uri2.split(":")[0];
    if (host) return host;
  }

  return undefined;
}

function defaultDevApiHost(): string {
  const fromExpo = hostFromExpo();
  if (fromExpo && fromExpo !== "localhost" && fromExpo !== "127.0.0.1") {
    return fromExpo;
  }
  if (__DEV__ && Platform.OS === "android") {
    return "10.0.2.2";
  }
  return "127.0.0.1";
}

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  `http://${defaultDevApiHost()}:5000`;

export const env = {
  apiBaseUrl,
} as const;
