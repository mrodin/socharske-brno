import { stackScreenOptions } from "@/utils/theme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen options={{ title: "Můj Profil" }} name="index" />
      <Stack.Screen options={{ title: "Změna hesla" }} name="password-change" />
      <Stack.Screen options={{ title: "Upravit profil" }} name="edit-profile" />
    </Stack>
  );
}
