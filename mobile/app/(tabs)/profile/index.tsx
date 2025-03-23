import { useState, useEffect, useContext, FC } from "react";
import { SafeAreaView, ScrollView, View, Text, Image } from "react-native";

import { Button } from "@/components/Button";
import { UserInfoContext } from "@/providers/UserInfo";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";

const Profile = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [username, setUsername] = useState("");

  if (!userInfo) return null;

  useEffect(() => {
    setUsername(userInfo.username);
  }, [userInfo]);

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View className="p-5">
        <View className="flex-coll justify-center items-center gap-4">
          <Text className="text-white w-full text-center font-bold text-3xl">
            {username}
          </Text>
          <View className="border-solid border-full border-2 rounded-full border-red-light">
            <Text className="color-red-light px-[5px] py-[3px] font-bold ">
              13. místo
            </Text>
          </View>
          {userInfo?.avatarUrl && (
            <Image
              source={{ uri: userInfo.avatarUrl }}
              accessibilityLabel="Avatar"
              style={{ width: 180, height: 180 }}
              className="object-cover rounded-full"
            />
          )}
        </View>

        <View className="gap-3 flex-row w-full pt-[30px]">
          <View className="bg-gray-light flex-1 rounded-2xl  px-3 py-7 gap-1">
            <Text className="text-white  ">Ulovené sochy</Text>
            <Text className="text-4xl font-bold text-white ">32</Text>
          </View>
          <View className="bg-gray-light flex-1 rounded-2xl  px-3 py-7 gap-1">
            <Text className="text-white  ">Skóre</Text>
            <Text className="text-4xl font-bold text-white ">176b</Text>
          </View>
        </View>

        <View className="gap-4 pt-[30px]">
          <Button
            variant="secondary"
            title="Upravit profil"
            onPress={() => {
              router.push("/profile/edit-profile");
            }}
          />
          <Button
            variant="primary"
            title="Odhlásit se"
            onPress={() => {
              supabase.auth.signOut();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
