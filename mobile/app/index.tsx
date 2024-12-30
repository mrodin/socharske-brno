import * as Font from "expo-font";
import { useEffect } from "react";
import "react-native-get-random-values";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Main } from "@/screens/Main";
import { UserSessionProvider } from "@/providers/UserSession";
import { UserInfoProvider } from "@/providers/UserInfo";
import { UserAvatarProvider } from "@/providers/UserAvatar";
import "@/primitives";
import "../global.css";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    Font.loadAsync({
      "RethinkSans-Regular": require("../assets/fonts/RethinkSans-VariableFont_wght.ttf"),
      "KronaOne-Regular": require("../assets/fonts/KronaOne-Regular.ttf"),
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserSessionProvider>
        <UserInfoProvider>
          <UserAvatarProvider>
            <Main />
          </UserAvatarProvider>
        </UserInfoProvider>
      </UserSessionProvider>
    </QueryClientProvider>
  );
}
