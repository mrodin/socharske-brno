import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/Button";
import { AppleIcon } from "@/icons/AppleIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { MailIcon } from "@/icons/MailIcon";
import { googleAuth } from "@/utils/googleAuth";
import AuthWrap from "@/components/auth/Wrap";
import { useRouter } from "expo-router";

import { appleAuth } from "@/utils/appleAuth";
import { supabase } from "@/utils/supabase";

async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  })
  if (error) {
    alert("Chyba"+ JSON.stringify(error));
  } else {
    alert("Úspěšné přihlášení: " + JSON.stringify(data));
  }
}

const Auth = () => {
  const router = useRouter();

  return (
    <AuthWrap showSubtitle>
      <Text className="text-white text-xl text-center mb-4 font-krona">
        PŘIHLÁSIT SE
      </Text>
      <View className="gap-4">
        <Button
          onPress={appleAuth}
          icon={<AppleIcon className="top-[2px]" />}
          title="Přihlásit se přes Apple"
        />
           <Button
          onPress={signInWithApple}
          icon={<AppleIcon className="top-[2px]" />}
          title="Přihlásit se přes Apple 2"
        />
        <Button
          onPress={googleAuth}
          icon={<GoogleIcon className="top-[2px]" />}
          title="Přihlásit se přes Google"
        />
        <Button
          onPress={() => router.navigate("/auth/email-signin")}
          icon={<MailIcon className="top" />}
          title="Přihlásit se přes Email"
        />
      </View>
      <Text className="text-white text-xl text-center mb-4 mt-10 font-krona">
        JSI TU POPRVÉ?
      </Text>
      <Button
        variant="primary"
        onPress={() => router.navigate("/auth/register")}
        title="Vytvořit účet"
      />
    </AuthWrap>
  );
};

export default Auth;
