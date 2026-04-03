// Ensure FormData exists before Expo/runtime modules initialize.
if (typeof globalThis.FormData === "undefined") {
  // Use RN's built-in FormData implementation on Android/Hermes.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RNFormData = require("react-native/Libraries/Network/FormData");
  const FormDataImpl = RNFormData.default ?? RNFormData;
  globalThis.FormData = FormDataImpl;
  // Some modules reference `global.FormData` directly.
  (globalThis as typeof globalThis & { global?: typeof globalThis }).global =
    (globalThis as typeof globalThis & { global?: typeof globalThis }).global ?? globalThis;
  (globalThis as typeof globalThis & { global?: typeof globalThis }).global!.FormData = FormDataImpl;
}
