import { Main } from "./app/screens/Main";
import { UserSessionProvider } from "./app/providers/UserSession";
import { FoundStatuesProvider } from "./app/providers/FoundStatues";
import * as Font from "expo-font";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    Font.loadAsync({
      "RethinkSans-Regular": require("./assets/fonts/RethinkSans-VariableFont_wght.ttf"),
    });
  }, []);
  return (
    <UserSessionProvider>
      <FoundStatuesProvider>
        <Main />
      </FoundStatuesProvider>
    </UserSessionProvider>
  );
}
