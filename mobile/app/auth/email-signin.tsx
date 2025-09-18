import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { setUserId, track } from "@amplitude/analytics-react-native";

import { StyledInput } from "@/components/StyledInput";
import AuthWrap from "@/components/auth/Wrap";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

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
        <Pressable
          onPress={() => router.navigate("/auth/password-reset-request")}
        >
          <Text className="underline text-white text-right">
            Zapomenuté heslo?
          </Text>
        </Pressable>
        <Button
          variant="secondary"
          title="Přihlásit"
          disabled={loading}
          onPress={signInWithEmail}
        />
        <Text className="text-white text-xl text-center mb-4 mt-10 font-krona">
          JSI TU POPRVÉ?
        </Text>
        <Button
          variant="primary"
          onPress={() => router.navigate("/auth/register")}
          title="Vytvořit účet"
        />
      </View>
    </AuthWrap>
  );
};

export default AuthEmailSignIn;
