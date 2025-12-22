import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { setUserId, track } from "@amplitude/analytics-react-native";

import { StyledInput } from "@/components/StyledInput";
import AuthWrap from "@/components/auth/Wrap";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";
import { IS_IOS } from "@/utils/platform";
import { appleAuth } from "@/utils/appleAuth";
import { AppleIcon } from "@/icons/AppleIcon";
import { googleAuth } from "@/utils/googleAuth";
import { GoogleIcon } from "@/icons/GoogleIcon";

const AuthEmailSignIn = () => {
  const router = useRouter();
  const { email: emailFromUrl } = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState(emailFromUrl ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // User is coming from email registration (we already have the email)
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const signInWithEmail = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      track("Login Failed", { method: "Email", error });
      Alert.alert("Špatné heslo nebo email");
    } else {
      setUserId(data?.user.id);
      track("Login Success", { method: "Email", userId: data?.user.id });
    }
    setLoading(false);
  };

  return (
    <AuthWrap showGoBack>
      <Text className="text-white text-xl text-center mb-4 font-krona">
        Vítej zpět!
      </Text>
      <View className="gap-8">
        <View className="gap-5">
          {IS_IOS && (
            <Button
              onPress={appleAuth}
              icon={<AppleIcon />}
              title="Přihlásit přes Apple"
            />
          )}
          <Button
            onPress={googleAuth}
            icon={<GoogleIcon className="top-[2px]" />}
            title="Přihlásit přes Google"
          />
        </View>
        <Text className="text-white text-center">nebo</Text>
        <View className="gap-5">
          <StyledInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            disabled={loading}
            placeholder="Email"
            autoCapitalize={"none"}
          />
          <StyledInput
            placeholder="Heslo"
            onChangeText={(text) => setPassword(text)}
            value={password}
            disabled={loading}
            autoCapitalize={"none"}
            secureTextEntry={true}
          />
          <Pressable
            onPress={() => router.navigate("/auth/password-reset-request")}
          >
            <Text className="underline text-white text-right -mt-1">
              Zapomenuté heslo?
            </Text>
          </Pressable>
          <Button
            variant="primary"
            title="Přihlásit se"
            disabled={loading}
            onPress={signInWithEmail}
          />
        </View>
        <View>
          <Text className="text-white text-center">
            Registrací souhlasíte s{" "}
            <Text className="underline">Podmínkami používání</Text>
            {"\n"} a se <Text className="underline">Zásadami ochrany</Text>{" "}
            osobních údajů
          </Text>
        </View>

        <Link href="/auth/register">
          <Text className="underline text-red-lightest text-center">
            Jsi tu poprvé? Zaregistruj se!
          </Text>
        </Link>
      </View>
    </AuthWrap>
  );
};

export default AuthEmailSignIn;
