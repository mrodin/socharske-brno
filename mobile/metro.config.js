const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ensure Metro resolves "browser" field for packages like @supabase/realtime-js
// to avoid importing Node-only modules (ws, stream) in React Native.
// Use per-platform conditions so "react-native" is checked first on native.
config.resolver.unstable_conditionsByPlatform = {
  ios: ["react-native", "browser", "require"],
  android: ["react-native", "browser", "require"],
  web: ["browser", "require"],
};

module.exports = withNativeWind(config, { input: "./global.css" });
