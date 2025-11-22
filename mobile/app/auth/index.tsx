import React from "react";
import { Text, View } from "react-native";
import { track } from "@amplitude/analytics-react-native";

import { Button } from "@/components/Button";
import { AppleIcon } from "@/icons/AppleIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { MailIcon } from "@/icons/MailIcon";
import { googleAuth } from "@/utils/googleAuth";
import AuthWrap from "@/components/auth/Wrap";
import { useRouter } from "expo-router";

import { appleAuth } from "@/utils/appleAuth";
import { IS_IOS } from "@/utils/platform";

const Auth = () => {
  const router = useRouter();

  const onEmailRedirect = () => {
    track("Login Redirect", { method: "Email" });
    router.navigate("/auth/email-signin");
  };

  const onRegisterRedirect = () => {
    track("Register Redirect", { from: "Login Screen" });
    router.navigate("/auth/register");
  };

  return (
    <AuthWrap showSubtitle>
      <Text className="text-white text-xl text-center mb-4 font-krona">
        PŘIHLÁSIT SE
      </Text>
      <View className="gap-4">
        {IS_IOS && (
          <Button
            onPress={appleAuth}
            icon={<AppleIcon className="top-[2px]" />}
            title="Přihlásit se přes Apple"
          />
        )}
        <Button
          onPress={googleAuth}
          icon={<GoogleIcon className="top-[2px]" />}
          title="Přihlásit se přes Google"
        />
        <Button
          onPress={onEmailRedirect}
          icon={<MailIcon className="top" />}
          title="Přihlásit se přes Email"
        />
      </View>
      <Text className="text-white text-xl text-center mb-4 mt-10 font-krona">
        JSI TU POPRVÉ?
      </Text>
      <Button
        variant="primary"
        onPress={onRegisterRedirect}
        title="Vytvořit účet"
      />
    </AuthWrap>
  );
};

export default Auth;
