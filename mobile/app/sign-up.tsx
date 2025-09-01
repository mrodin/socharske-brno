import { StyledInput } from "@/components/StyledInput";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useContext, useState } from "react";
import { Button } from "@/components/Button";
import { UserInfoContext } from "@/providers/UserInfo";
import { router } from "expo-router";
import { WizardProviderContext } from "@/providers/WizardProvider";
const SignUp = () => {
  const { updateProfile } = useContext(UserInfoContext);
  const { setStep: setWizardStep } = useContext(WizardProviderContext);

  const [username, setUsername] = useState("");

  const handleSaveUsername = () => {
    updateProfile({
      username,
    });
    router.push("/(tabs)");
    setWizardStep(1);
  };

  return (
    <View className="h-full p-5 bg-gray w-full">
      <SafeAreaView className="flex-1 bg-gray">
        <ScrollView automaticallyAdjustKeyboardInsets>
          <View className="flex-1 justify-center">
            <View className="gap-4 justify-self-center flex items-center mt-12">
              <Text className="text-white text-xl text-center mb-8 uppercase">
                Vyber si uživatelské jméno
              </Text>
            </View>
            <View className="gap-6">
              <StyledInput
                onChangeText={(text) => setUsername(text)}
                value={username}
                placeholder="Uživatelské jméno"
                autoCapitalize={"none"}
              />
              <Button
                onPress={handleSaveUsername}
                title="Pokračovat do hry"
                variant="primary"
              />
              <Text className=" text-white text-center ">
                Uživatelské jméno si můžete kdykoliv změnit.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SignUp;
