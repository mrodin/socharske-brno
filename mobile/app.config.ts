import { ConfigContext, ExpoConfig } from "@expo/config";
import * as dotenv from "dotenv";

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Lovci Soch",
  scheme: "lovci-soch",
  slug: "mobile",
  version: "1.0.0",
  owner: "kulturni-lenochodi",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    buildNumber: "10",
    bundleIdentifier: "com.kulturnilenochodi.socharske-brno",
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
    supportsTablet: true,
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.anonymous.mobile",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-font",
    "expo-apple-authentication",
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme:
          "com.googleusercontent.apps.865962598053-cpic88pj6c8raaqlsca0qhua9mk1id7c",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "a70636d6-cd78-4d4e-a04b-c6ab4072227a",
    },
  },
});
