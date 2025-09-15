import { useState, useEffect, useContext } from "react";
import { View } from "react-native";

import { Button } from "@/components/Button";
import { StyledInput } from "@/components/StyledInput";
import { UserInfoContext } from "@/providers/UserInfo";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { Alert } from "react-native";
import { track } from "@amplitude/analytics-react-native";

const PasswordChange = ({}) => {
  const { userInfo } = useContext(UserInfoContext);
  const [newPassword, setNewPassword] = useState("");

  if (!userInfo) return null;

  useEffect(() => {
    setNewPassword("");
  }, [userInfo]);

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        console.log(error.code);
        track("Password Change Failed", { error });
        if (error.code === "weak_password") {
          Alert.alert("Heslo je příliš slabé, minimum je 6 znaků");
        } else if (error.code === "same_password") {
          Alert.alert("Nové heslo je stejné jako staré");
        } else {
          Alert.alert("Chyba při změně hesla");
        }
      } else {
        track("Password Change Success");
        Alert.alert("Heslo bylo úspěšně změněno");
        router.back();
      }
    } catch (error) {
      track("Password Change Failed", { error });
      Alert.alert("Chyba při změně hesla");
    }
  };

  return (
    <View className="bg-gray h-full w-full p-5 pt-[20px]">
      <View className="gap-3">
        <StyledInput
          secureTextEntry
          label="Nové heslo"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <Button
          variant="secondary"
          title="Uložit"
          onPress={handleChangePassword}
        />
      </View>
    </View>
  );
};

export default PasswordChange;
