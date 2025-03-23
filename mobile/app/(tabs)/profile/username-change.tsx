import { useState, useContext } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { Button } from "@/components/Button";
import { StyledInput } from "@/components/StyledInput";
import { UserInfoContext } from "@/providers/UserInfo";
import { router } from "expo-router";

const Profile = () => {
  const { userInfo, updateProfile, loading } = useContext(UserInfoContext);
  const [userName, setUserName] = useState(userInfo?.username);

  const handleChangeUsername = async () => {
    updateProfile({
      username: userName,
    });
    router.back();
  };

  return (
    <View className="bg-gray h-full w-full h-full  p-5 pt-[20px]">
      <View className="gap-3 ">
        <StyledInput
          label="Nové uživatelské jméno"
          value={userName}
          onChangeText={(text) => setUserName(text)}
        />
        <Button
          variant="secondary"
          title="Uložit"
          onPress={handleChangeUsername}
        />
      </View>
    </View>
  );
};

export default Profile;
