import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#393939",
        },
        headerTintColor: "rgba(235, 235, 235, 1)",
        headerTitleStyle: {
          fontWeight: "400",
        },
        contentStyle: {
          backgroundColor: "#393939",
          paddingBottom: 96, // to match the bottom navigation height
        },
      }}
    >
      <Stack.Screen options={{ title: "Můj Profil" }} name="index" />
      <Stack.Screen options={{ title: "Změna hesla" }} name="password-change" />
      <Stack.Screen options={{ title: "Upravit profil" }} name="edit-profile" />
    </Stack>
  );
}
