import { UserInfoContext } from "@/providers/UserInfo";
import { stackScreenOptions } from "@/utils/theme";
import { Stack } from "expo-router";
import { useContext } from "react";

export default function RootLayout() {
  const { userInfo } = useContext(UserInfoContext);
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen
        options={{ title: userInfo?.username ?? "Profil" }}
        name="index"
      />
      <Stack.Screen options={{ title: "Změna hesla" }} name="password-change" />
      <Stack.Screen options={{ title: "Upravit profil" }} name="edit-profile" />
      <Stack.Screen options={{ title: "Smazat účet" }} name="delete-profile" />
    </Stack>
  );
}
