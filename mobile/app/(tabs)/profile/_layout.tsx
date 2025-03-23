import { UserInfoContext } from "@/providers/UserInfo";
import { Stack } from "expo-router";
import { useContext } from "react";

export default function RootLayout() {
  const { userInfo, updateProfile, loading } = useContext(UserInfoContext);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#393939",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen options={{ title: userInfo?.username }} name="index" />
      <Stack.Screen options={{ title: "Změna hesla" }} name="password-change" />
      <Stack.Screen options={{ title: "Změna jména" }} name="username-change" />
    </Stack>
  );
}
