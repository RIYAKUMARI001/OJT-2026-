const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../node_modules"),
];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  react: path.resolve(__dirname, "node_modules/react"),
  "react-native": path.resolve(__dirname, "node_modules/react-native"),
  "react-native-reanimated": path.resolve(
    __dirname,
    "node_modules/react-native-reanimated"
  ),
  "react-native-worklets": path.resolve(
    __dirname,
    "node_modules/react-native-worklets"
  ),
  "react-native-css-interop": path.resolve(
    __dirname,
    "node_modules/react-native-css-interop"
  ),
};

module.exports = withNativeWind(config, { input: "./global.css" });
