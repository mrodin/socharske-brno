import { Main } from "./app/screens/Main";
import { UserSessionProvider } from "./app/providers/UserSession";
import { FoundStatuesProvider } from "./app/providers/FoundStatues";
import * as Font from "expo-font";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserInfoProvider } from "./app/providers/UserInfo";
import { UserAvatarProvider } from "./app/providers/UserAvatar";

export default function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    Font.loadAsync({
      "RethinkSans-Regular": require("./assets/fonts/RethinkSans-VariableFont_wght.ttf"),
      "KronaOne-Regular": require("./assets/fonts/KronaOne-Regular.ttf"),
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserSessionProvider>
        <UserInfoProvider>
          <UserAvatarProvider>
            <FoundStatuesProvider>
              <Main />
            </FoundStatuesProvider>
          </UserAvatarProvider>
        </UserInfoProvider>
      </UserSessionProvider>
    </QueryClientProvider>
  );
}
