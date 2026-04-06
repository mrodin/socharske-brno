import * as Font from "expo-font";
import {
  Slot,
  useGlobalSearchParams,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { Toaster } from "sonner-native";
import { FC, useEffect } from "react";
import { Platform } from "react-native";
import "react-native-get-random-values";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { init, track } from "@amplitude/analytics-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

import { UserSessionContext } from "@/providers/UserSession";
import "../global.css";
import { useUserSession } from "@/hooks/useUserSession";
import { LoadingScreen } from "@/screens/LoadingScreen";

const useAnalytics = () => {
  useEffect(() => {
    if (!process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY) {
      throw new Error("Missing Amplitude API Key");
    }
    init(
      process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
      process.env.EXPO_PUBLIC_AMPLITUDE_USER_ID,
      { disableCookies: true }
    )
      .promise.then(() => {
        console.log("Amplitude initialized");
      })
      .catch((e) => {
        console.error("Amplitude init error", e);
      });
  }, []);
};

const queryClient = new QueryClient();

const RootLayout: FC = () => {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const router = useRouter();
  const segments = useSegments();
  const { user, loading, session, setSession } = useUserSession();

  useAnalytics();

  useEffect(() => {
    if (Platform.OS === "android") {
      setStatusBarHidden(true, "fade");
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  useEffect(() => {
    Font.loadAsync({
      "RethinkSans-Regular": require("../assets/fonts/RethinkSans-VariableFont_wght.ttf"),
      "KronaOne-Regular": require("../assets/fonts/KronaOne-Regular.ttf"),
    });
  }, []);

  useEffect(() => {
    track("Page View", { pathname, params });
  }, [pathname, params]);

  useEffect(() => {
    if (loading) return;

    if (pathname === "/") {
      if (user) {
        router.replace("/(app)/(tabs)");
      } else {
        router.replace("/auth");
      }
    }
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup) {
      // Redirect to auth if not authenticated
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      // Redirect to app if authenticated
      router.replace("/(app)/(tabs)");
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  const statusBarStyle = pathname === "/" ? "dark" : "light";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <StatusBar style={statusBarStyle} />
        <UserSessionContext.Provider value={{ loading, session, setSession }}>
          <QueryClientProvider client={queryClient}>
            <Slot />
          </QueryClientProvider>
        </UserSessionContext.Provider>
        <Toaster />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
