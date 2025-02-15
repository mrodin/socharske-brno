import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { useRouter } from "expo-router";
import { StyledInput } from "@/components/StyledInput";
import * as Linking from "expo-linking";
import GoBackHeader from "@/components/auth/GoBackHeader";
import { supabase } from "@/utils/supabase";

const PasswordResetRequest = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event);
      if (event == "PASSWORD_RECOVERY") {
        console.log("PASSWORD_RECOVERY");
        const newPassword = prompt(
          "What would you like your new password to be?"
        );
        // const { data, error } = await supabase.auth.updateUser({
        //   password: newPassword,
        // });

        // if (data) alert("Password updated successfully!");
        // if (error) alert("There was an error updating your password.");
      }
    });
  }, []);

  const handleResetPassword = async () => {
    const resetPasswordURL = Linking.createURL("auth/password-reset");
    console.log(resetPasswordURL);
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
      Alert.alert("Odkaz na obnovení hesla byl odeslán na váš email");
    }
    console.log(data);
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
          <GoBackHeader />
          <View className="gap-4 justify-self-center  mb-10">
            <Text className="text-white text-xl text-center mb-4 font-krona">
              ZAPOMNĚLI JSTE HESLO?
            </Text>
            <Text className="text-white">
              Vyplňte svůj email, kam vám pošelem odkaz k vytvoření nového hesla
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
              title="Zažádat o nové heslo"
              disabled={loading}
              onPress={handleResetPassword}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default PasswordResetRequest;
