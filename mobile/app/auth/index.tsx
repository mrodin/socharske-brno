import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/Button";
import { AppleIcon } from "@/icons/AppleIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { MailIcon } from "@/icons/MailIcon";
import { googleAuth } from "@/utils/googleAuth";
import AuthWrap from "@/components/auth/Wrap";
import { Link, useRouter } from "expo-router";

const Auth = () => {
  const router = useRouter();

  return (
    <AuthWrap showSubtitle>
      <Text className="text-white text-xl text-center mb-4 font-krona">
        PŘIHLÁSIT SE
      </Text>
      <View className="gap-4">
        <Button icon={<AppleIcon />} title="Přihlásit se přes Apple" />
        <Button
          onPress={googleAuth}
          icon={<GoogleIcon className="top-[2px]" />}
          title="Přihlásit se přes Google"
        />
        <Button
          onPress={() => router.push("/auth/email-signin")}
          icon={<MailIcon className="top" />}
          title="Přihlásit se přes Email"
        />
      </View>
      <Text className="text-white text-xl text-center mb-4 mt-10 font-krona">
        JSI TU POPRVÉ?
      </Text>
      <Button
        variant="primary"
        onPress={() => router.push("/auth/register")}
        title="Vytvořit účet"
      />
    </AuthWrap>
  );
};

export default Auth;
