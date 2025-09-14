import { useState, useContext, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

import { Button } from "@/components/Button";
import { StyledInput } from "@/components/StyledInput";
import { UserInfoContext } from "@/providers/UserInfo";
import { router } from "expo-router";
import Avatar from "@/components/Avatar";
import { track } from "@amplitude/analytics-react-native";

const EditProfile = ({}) => {
  const { userInfo, updateProfile } = useContext(UserInfoContext);
  const [userName, setUserName] = useState(userInfo?.username);

  const handleChangeUsername = () => {
    updateProfile({
      username: userName,
    });
    track("Profile Edit - Change Username", { username: userName });
    router.back();
  };

  useEffect(() => {
    track("Page View", { page: "Profile - Edit" });
  }, []);

  if (!userInfo) return null;

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View className="gap-5 p-5">
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
        {userInfo.provider === "email" && (
          <Pressable
            className="pt-4 pb-4"
            onPress={() => router.navigate("/profile/password-change")}
          >
            <Text className="color-white underline">Změnit heslo</Text>
          </Pressable>
        )}
        <Button
          variant="primary"
          title="Uložit"
          disabled={userName === userInfo.username}
          onPress={handleChangeUsername}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;
