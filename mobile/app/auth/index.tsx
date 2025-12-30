import React from "react";
import { View } from "react-native";

import { Button } from "@/components/Button";
import AuthWrap from "@/components/auth/Wrap";
import { useRouter } from "expo-router";

import { SpravedlnostImg } from "@/components/auth/SpravedlnostSvg";

const Auth = () => {
  const router = useRouter();

  return (
    <AuthWrap showSubtitle>
      <View className="flex items-center">
        <SpravedlnostImg />
      </View>
      <View className="flex-1" />
      <View className="flex flex-cell gap-5 ">
        <Button
          variant="primary"
          onPress={() => router.navigate("/auth/register")}
          title="Vytvořit účet"
        />
        <Button
          variant="secondary"
          onPress={() => router.navigate("/auth/signin")}
          title="Přihlásit se"
        />
      </View>
    </AuthWrap>
  );
};

export default Auth;
