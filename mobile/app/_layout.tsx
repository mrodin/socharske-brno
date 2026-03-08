import * as Font from "expo-font";
import {
  Slot,
  useGlobalSearchParams,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { FC, useEffect } from "react";
import "react-native-get-random-values";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { init, track } from "@amplitude/analytics-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserSessionContext.Provider value={{ loading, session, setSession }}>
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </UserSessionContext.Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
