import { StyleSheet } from "react-native";
import { Main } from "./app/screens/Main";
import { UserSessionProvider } from "./app/providers/UserSession";

export default function App() {
  return (
    <UserSessionProvider>
      <Main />
    </UserSessionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
