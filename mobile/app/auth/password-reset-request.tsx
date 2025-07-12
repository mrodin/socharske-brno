import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { StyledInput } from "@/components/StyledInput";
import * as Linking from "expo-linking";
import GoBackHeader from "@/components/auth/GoBackHeader";
import { supabase } from "@/utils/supabase";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [loading] = useState(false);

  const handleResetPassword = async () => {
    const resetPasswordURL = Linking.createURL("auth/password-reset");
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordURL,
    });

    if (error) {
      if (error.code === "validation_failed") {
        Alert.alert("Email je špatně zadaný");
      } else {
        Alert.alert("Něco se pokazilo: " + error.message);
        console.log(error.message);
      }
    } else {
      Alert.alert("Odkaz na přihlášení byl odeslán na váš email");
    }
  };

  return (
    <>
      <View className="h-full px-5 bg-gray w-full flex align-center">
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <SafeAreaView>
            <GoBackHeader />
            <View className="gap-4 justify-self-center  mb-10">
              <Text className="text-white text-xl text-center mb-4 font-krona">
                ZAPOMNĚLI JSTE HESLO?
              </Text>
              <Text className="text-white">
                Vyplňte svůj email, kam vám pošelem odkaz k přihlášení. Poté si
                budete moct své heslo změnit v aplikaci (záložka profil).
              </Text>
            </View>
            <View className="gap-10">
              <StyledInput
                onChangeText={(text) => setEmail(text)}
                value={email}
                disabled={loading}
                placeholder="Email"
                autoCapitalize={"none"}
              />
              <Button
                variant="primary"
                title="Zažádat o odkaz k přihlášení"
                disabled={loading}
                onPress={handleResetPassword}
              />
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </>
  );
};

export default PasswordResetRequest;
