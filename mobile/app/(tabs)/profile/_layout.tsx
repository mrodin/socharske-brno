import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#393939",
        },
        headerTintColor: "#fff",
        contentStyle: {
          backgroundColor: "#393939",
        },
      }}
    >
      <Stack.Screen options={{ title: "Můj Profil" }} name="index" />
      <Stack.Screen options={{ title: "Změna hesla" }} name="password-change" />
      <Stack.Screen options={{ title: "Upravit profil" }} name="edit-profile" />
    </Stack>
  );
}
