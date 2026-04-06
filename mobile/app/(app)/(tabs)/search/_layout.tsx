import { stackScreenOptions } from "@/utils/theme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen options={{ title: "Vyhledávání" }} name="index" />
    </Stack>
  );
}
