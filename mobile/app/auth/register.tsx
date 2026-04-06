import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { track } from "@amplitude/analytics-react-native";

import { supabase } from "@/utils/supabase";
import { Button } from "@/components/Button";
import { AppleIcon } from "@/icons/AppleIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { googleAuth } from "@/utils/googleAuth";
import { StyledInput } from "@/components/StyledInput";
import AuthWrap from "@/components/auth/Wrap";
import { Link, router } from "expo-router";
import { appleAuth } from "@/utils/appleAuth";
import { IS_IOS } from "@/utils/platform";
import { PasswordInput } from "@/components/PasswordInput";

const AuthRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpWithEmail = async () => {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: Linking.createURL("auth/email-signin"),
      },
    });
    setLoading(false);

    if (error) {
      track("Sign Up Failed", { method: "Email", error: error.message });
      Alert.alert(error.message);
    } else {
      if (!session) {
        Alert.alert("Zkontrolujte si email a potvrďte registraci");
      }
      track("Sign Up Success", { method: "Email", userId: session?.user?.id });
      router.navigate({ pathname: "/auth/signin", params: { email } });
    }
  };

  return (
    <AuthWrap showGoBack>
      <Text className="text-white text-xl text-center mb-4 font-krona">
        VYTVOŘIT NOVÝ ÚČET
      </Text>
      <View className="gap-8">
        <View className="gap-5">
          {IS_IOS && (
            <Button
              onPress={appleAuth}
              icon={<AppleIcon />}
              title="Registrovat přes Apple"
            />
          )}
          <Button
            onPress={googleAuth}
            icon={<GoogleIcon className="top-[2px]" />}
            title="Registrovat přes Google"
          />
        </View>
        <Text className="text-white text-center">nebo</Text>
        <View className="gap-5 ">
          <StyledInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            disabled={loading}
            placeholder="Email"
            autoCapitalize={"none"}
          />
          <PasswordInput
            placeholder="Heslo"
            onChangeText={(text) => setPassword(text)}
            disabled={loading}
            value={password}
            autoCapitalize={"none"}
          />
          <Text className="text-white -mt-1">
            Heslo musí mít alespoň 6 znaků
          </Text>
          <Button
            variant="primary"
            title="Registrovat"
            disabled={loading}
            onPress={signUpWithEmail}
          />
        </View>
        <View>
          <Text className="text-white text-center">
            Registrací souhlasíte s{" "}
            <Link href="https://www.lovcisoch.cz/podminky-pouzivani-aplikace">
              <Text className="underline">Podmínkami používání</Text>
            </Link>
            {"\n"} a se{" "}
            <Link href="https://www.lovcisoch.cz/gdpr">
              <Text className="underline">Zásadami ochrany</Text>
            </Link>{" "}
            osobních údajů
          </Text>
        </View>

        <Link href="/auth/signin">
          <Text className="underline text-red-lightest text-center">
            Už máš účet? Přihlaš se.
          </Text>
        </Link>
      </View>
    </AuthWrap>
  );
};

export default AuthRegister;
