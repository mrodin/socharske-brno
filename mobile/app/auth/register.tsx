import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/Button";
import { AppleIcon } from "@/icons/AppleIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { googleAuth } from "@/utils/googleAuth";
import { StyledInput } from "@/components/StyledInput";
import AuthWrap from "@/components/auth/Wrap";
import { Link } from "expo-router";
import { appleAuth } from "@/utils/appleAuth";

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
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Zkontrolujte si email a potvrďte registraci");
    setLoading(false);
  };

  return (
    <AuthWrap>
      <Text className="text-white text-xl text-center mb-4 font-krona">
        VYTVOŘIT NOVÝ ÚČET
      </Text>
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
          disabled={loading}
          value={password}
          autoCapitalize={"none"}
          secureTextEntry={true}
        />
        <Button
          variant="primary"
          title="Registrovat"
          disabled={loading}
          onPress={signUpWithEmail}
        />
        <Text className="text-white text-center">nebo</Text>
        <Button
          onPress={appleAuth}
          icon={<AppleIcon />}
          title="Registrovat se přes Apple"
        />
        <Button
          onPress={googleAuth}
          icon={<GoogleIcon className="top-[2px]" />}
          title="Registrovat se přes Google"
        />
        <View className="mt-5">
          <Link href="/auth">
            <Text className="underline text-red-light text-center">
              Už máš účet? Přihlaš se.
            </Text>
          </Link>
        </View>
      </View>
    </AuthWrap>
  );
};

export default AuthRegister;
