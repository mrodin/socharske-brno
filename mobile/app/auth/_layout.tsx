import { UserSessionContext } from "@/providers/UserSession";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { Stack } from "expo-router";
import { useContext } from "react";

export default function Layout() {
  const { loading } = useContext(UserSessionContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
