import { useState, useContext } from "react";
import { View, Text, Pressable } from "react-native";

import { Button } from "@/components/Button";
import { StyledInput } from "@/components/StyledInput";
import { UserInfoContext } from "@/providers/UserInfo";
import { router } from "expo-router";
import Avatar from "@/components/Avatar";

const EditProfile = ({}) => {
  const { userInfo, updateProfile } = useContext(UserInfoContext);
  const [userName, setUserName] = useState(userInfo?.username);

  const handleChangeUsername = async () => {
    updateProfile({
      username: userName,
    });
    router.back();
  };

  if (!userInfo) return null;

  return (
    <View className="bg-gray h-full w-full p-5 pt-[20px]">
      <View className="gap-5">
        <Avatar
          size={180}
          onUpload={(url: string) => {
            updateProfile({
              avatar_url: url,
            });
          }}
        />
        <StyledInput label="E-mail" value={userInfo.email} readOnly />
        <StyledInput
          label="Uživatelské jméno"
          value={userName}
          onChangeText={(text) => setUserName(text)}
        />
        {/* @TODO - implement birth date to DB*/}
        <StyledInput label="Datum narození" value="2.5.1991" />
        {userInfo.provider === "email" && (
          <Pressable
            className="pt-4 pb-4"
            onPress={() => router.push("/profile/password-change")}
          >
            <Text className="color-white underline">Změnit heslo</Text>
          </Pressable>
        )}
        <Button
          variant="primary"
          title="Uložit"
          onPress={handleChangeUsername}
        />
      </View>
    </View>
  );
};

export default EditProfile;
