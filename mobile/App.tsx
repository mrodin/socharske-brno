import { Main } from "./app/screens/Main";
import { UserSessionProvider } from "./app/providers/UserSession";
import { FoundStatuesProvider } from "./app/providers/FoundStatues";
import * as Font from "expo-font";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    Font.loadAsync({
      "RethinkSans-Regular": require("./assets/fonts/RethinkSans-VariableFont_wght.ttf"),
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserSessionProvider>
        <FoundStatuesProvider>
          <Main />
        </FoundStatuesProvider>
      </UserSessionProvider>
    </QueryClientProvider>
  );
}
