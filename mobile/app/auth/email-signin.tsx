import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Button } from "@/components/Button";

import { StyledInput } from "@/components/StyledInput";
import AuthWrap from "@/components/auth/Wrap";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

const AuthEmailSignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert("Špatné heslo nebo email");
    setLoading(false);
  };

  return (
    <AuthWrap>
      <Text className="text-white text-xl text-center mb-4 font-krona">
        PŘIHLÁSIT SE
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
          value={password}
          disabled={loading}
          autoCapitalize={"none"}
          secureTextEntry={true}
        />
        <Pressable onPress={() => router.push("/auth/password-reset-request")}>
          <Text className="underline text-white text-right">
            Zapomenuté heslo?
          </Text>
        </Pressable>
        <Button
          variant="secondary"
          title="Přihlásit"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
        <Text className="text-white text-xl text-center mb-4 mt-10 font-krona">
          JSI TU POPRVÉ?
        </Text>
        <Button
          variant="primary"
          onPress={() => router.push("/auth/register")}
          title="Vytvořit účet"
        />
      </View>
    </AuthWrap>
  );
};

export default AuthEmailSignIn;
