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
  assetBundlePatterns: ["**/*"],
  ios: {
    buildNumber: "10",
    bundleIdentifier: "com.kulturnilenochodi.socharske-brno",
    icon: "./assets/icon.png",
    supportsTablet: true,
    usesAppleSignIn: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "This app requires access to your location when open.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "This app requires access to your location even when closed.",
      NSLocationAlwaysUsageDescription:
        "This app requires access to your location when open.",
      UIBackgroundModes: ["remote-notification"],
    },
  },
  android: {
    icon: "./assets/icon.png",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#DF3F34",
    },
    package: "com.kulturnilenochodi.socharskebrno",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-notifications",
      {
        color: "#DF3F34",
      },
    ],
    "expo-apple-authentication",
    "./plugins/withDisplayCutout",
    [
      "./plugins/withGoogleMaps",
      {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: process.env.EXPO_IOS_URL_SCHEME,
      },
    ],
    [
      "expo-splash-screen",
      {
        ios: {
          backgroundColor: "#393939",
          image: "./assets/splash-icon.png",
          resizeMode: "cover",
        },
        android: {
          backgroundColor: "#393939",
          image: "./assets/splash-icon.png",
          imageWidth: 130,
        },
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
