import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { supabase } from "../utils/supabase";
import { Button } from "../components/Button";
import { AppleIcon } from "../icons/AppleIcon";
import { GoogleIcon } from "../icons/GoogleIcon";
import { googleAuth } from "../utils/googleAuth";
import { StyledInput } from "../components/StyledInput";
import { appleAuth } from "@/utils/appleAuth";

export const Auth = () => {
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
    <View className="h-full p-5 bg-gray w-full">
      <ScrollView automaticallyAdjustKeyboardInsets>
        <View className="gap-4 justify-self-center flex items-center mt-10">
          <Text className="text-white text-[40px] text-center w-[200px] font-krona">
            LOVCI SOCH
          </Text>
          <Text className="text-white text-xl text-center w-[250px] mb-8">
            Vydej se na dobrodružství a ulov si brněnské sochy
          </Text>
        </View>
        <Text className="text-white text-xl text-center mb-4 font-krona">
          PŘIHLÁSIT SE
        </Text>
        <View className="gap-4">
          <StyledInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            autoCapitalize={"none"}
          />
          <StyledInput
            placeholder="Heslo"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize={"none"}
            secureTextEntry={true}
          />
          <Button
            onPress={() => signInWithEmail()}
            title="Přihlásit se"
            disabled={loading}
            variant="primary"
          />
          <Button
            onPress={() => signUpWithEmail()}
            title="Vytvořit účet"
            disabled={loading}
            variant="secondary"
          />
          <Text className="text-white text-base text-center">Nebo přes</Text>
          <Button
            onPress={appleAuth}
            icon={<AppleIcon />}
            title="Přihlásit se přes Apple"
          />
          <Button
            onPress={googleAuth}
            icon={<GoogleIcon className="top-[2px]" />}
            title="Přihlásit se přes Google"
          />
        </View>
      </ScrollView>
    </View>
  );
};
