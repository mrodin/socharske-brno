import { useState, useEffect, useContext, FC } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/Button";
import { UserInfoContext } from "@/providers/UserInfo";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";

type ProfileProps = { onClickBack: () => void };

const Profile: FC<ProfileProps> = ({ onClickBack }) => {
  const { userInfo, updateProfile, loading } = useContext(UserInfoContext);
  const [username, setUsername] = useState("");

  if (!userInfo) return null;

  useEffect(() => {
    setUsername(userInfo.username);
  }, [userInfo]);

  return (
    <View className="bg-gray h-full w-full p-5 pt-[20px]">
      <SafeAreaView>
        <ScrollView automaticallyAdjustKeyboardInsets>
          <View className="gap-8">
            <View>
              <View className="items-center">
                <Avatar
                  size={200}
                  onUpload={(url: string) => {
                    updateProfile({
                      avatar_url: url,
                    });
                  }}
                />
              </View>
            </View>
            <View>
              <View className="gap-3">
                <Text className="text-white text-xl w-full">{username}</Text>
                <View className="gap-3 flex-row  w-full">
                  <View className="bg-gray-light flex-1 rounded-2xl  px-3 py-7 gap-1">
                    <Text className="text-white  ">Ulovené sochy</Text>
                    <Text className="text-4xl font-bold text-white ">32</Text>
                  </View>
                  <View className="bg-gray-light flex-1 rounded-2xl  px-3 py-7 gap-1">
                    <Text className="text-white  ">Skóre</Text>
                    <Text className="text-4xl font-bold text-white ">176b</Text>
                  </View>
                </View>

                <Button
                  variant="secondary"
                  title="Změnit uživatelské jméno"
                  onPress={() => {
                    router.push("/profile/username-change");
                  }}
                />

                {userInfo.provider === "email" && (
                  <Button
                    variant="secondary"
                    title="Změnit heslo"
                    onPress={() => {
                      router.push("/profile/password-change");
                    }}
                  />
                )}
                <Button
                  variant="primary"
                  title="Odhlásit se"
                  onPress={() => {
                    supabase.auth.signOut();
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Profile;
