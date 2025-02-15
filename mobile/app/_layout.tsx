import * as Font from "expo-font";
import { Stack, useRouter } from "expo-router";
import { FC, useContext, useEffect } from "react";
import "react-native-get-random-values";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  UserSessionContext,
  UserSessionProvider,
} from "@/providers/UserSession";
import { UserInfoProvider } from "@/providers/UserInfo";
import { UserAvatarProvider } from "@/providers/UserAvatar";
import "../global.css";

const queryClient = new QueryClient();

const RootLayout: FC = () => {
  useEffect(() => {
    Font.loadAsync({
      "RethinkSans-Regular": require("../assets/fonts/RethinkSans-VariableFont_wght.ttf"),
      "KronaOne-Regular": require("../assets/fonts/KronaOne-Regular.ttf"),
    });
  }, []);

  const router = useRouter();
  const { isAuthentizating, session } = useContext(UserSessionContext);

  useEffect(() => {
    if (!isAuthentizating) {
      if (!session) {
        router.push("/auth");
      } else {
        router.push("/");
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserSessionProvider>
        <UserInfoProvider>
          <UserAvatarProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </UserAvatarProvider>
        </UserInfoProvider>
      </UserSessionProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
