import * as Font from "expo-font";
import { Stack } from "expo-router";
import { FC, useEffect } from "react";
import "react-native-get-random-values";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { init } from "@amplitude/analytics-react-native";

import { UserSessionProvider } from "@/providers/UserSession";
import { UserInfoProvider } from "@/providers/UserInfo";
import { UserAvatarProvider } from "@/providers/UserAvatar";
import "../global.css";
import AuthRedirect from "@/components/AuthRedirect";
import { LocationProvider } from "@/providers/LocationProvider";
import { SelectedStatueProvider } from "@/providers/SelectedStatueProvider";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { WizardProvider } from "@/providers/WizardProvider";

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
  useAnalytics();
  useEffect(() => {
    Font.loadAsync({
      "RethinkSans-Regular": require("../assets/fonts/RethinkSans-VariableFont_wght.ttf"),
      "KronaOne-Regular": require("../assets/fonts/KronaOne-Regular.ttf"),
    });
  }, []);

  return (
    <UserSessionProvider>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <UserInfoProvider>
            <AuthRedirect>
              <UserAvatarProvider>
                <LocationProvider>
                  <SelectedStatueProvider>
                    <WizardProvider>
                      <Stack>
                        <Stack.Screen
                          name="(tabs)"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="auth"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="sign-out"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="sign-up"
                          options={{ headerShown: false }}
                        />
                      </Stack>
                    </WizardProvider>
                  </SelectedStatueProvider>
                </LocationProvider>
              </UserAvatarProvider>
            </AuthRedirect>
          </UserInfoProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </UserSessionProvider>
  );
};

export default RootLayout;
