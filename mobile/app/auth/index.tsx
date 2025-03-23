import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/Button";
import { AppleIcon } from "@/icons/AppleIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { MailIcon } from "@/icons/MailIcon";
import { googleAuth } from "@/utils/googleAuth";
import AuthWrap from "@/components/auth/Wrap";
import { Link, useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";

const Auth = () => {
  const router = useRouter();

  return (
    <AuthWrap showSubtitle>
      <Text className="text-white text-xl text-center mb-4 font-krona">
        PŘIHLÁSIT SE
      </Text>
      <View className="gap-4">
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
      <View>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{
            width: 200,
            height: 44,
          }}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              // signed in
            } catch (e) {
              if (e.code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
              } else {
                // handle other errors
              }
            }
          }}
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
