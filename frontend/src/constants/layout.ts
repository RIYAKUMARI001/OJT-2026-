import type { ViewStyle } from "react-native";

/** Larger touch target for small arrow / icon buttons (NativeWind + Hermes). */
export const BACK_HIT_SLOP = { top: 14, bottom: 14, left: 14, right: 14 } as const;

export const rowTouch: ViewStyle = { paddingVertical: 8, paddingHorizontal: 4 };
