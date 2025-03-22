import * as Font from "expo-font";
import { Stack } from "expo-router";
import { FC, useEffect, Context } from "react";
import "react-native-get-random-values";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserSessionProvider } from "@/providers/UserSession";
import { UserInfoProvider } from "@/providers/UserInfo";
import { UserAvatarProvider } from "@/providers/UserAvatar";
import "../global.css";
import AuthRedirect from "@/components/AuthRedirect";
import { LocationProvider } from "@/providers/LocationProvider";
import { SelectedStatueProvider } from "@/providers/SelectedStatueProvider";
import { LoadingProvider } from "@/providers/LoadingProvider";

const queryClient = new QueryClient();

const RootLayout: FC = () => {
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
                    <Stack>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="auth"
                        options={{ headerShown: false }}
                      />
                    </Stack>
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
