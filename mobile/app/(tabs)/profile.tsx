import { useState, useEffect, useContext, FC } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/Button";
import { StyledInput } from "@/components/StyledInput";
import { ArrowLeft } from "@/icons/ArrowLeft";
import { UserInfoContext } from "@/providers/UserInfo";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";

type ProfileProps = { onClickBack: () => void };

const Profile: FC<ProfileProps> = ({ onClickBack }) => {
  const { userInfo, updateProfile, loading } = useContext(UserInfoContext);
  const [username, setUsername] = useState("");
  const router = useRouter();

  if (!userInfo) return null;

  useEffect(() => {
    setUsername(userInfo.username);
  }, [userInfo]);

  return (
    <View className="bg-gray h-full w-full p-5 pt-[20px]">
      <SafeAreaView>
        <ScrollView automaticallyAdjustKeyboardInsets>
          <TouchableOpacity onPress={onClickBack} className="z-[2] mb-4">
            <ArrowLeft width={16} height={32} />
          </TouchableOpacity>
          <View className="gap-8">
            <View>
              <Text className="text-2xl	text-center font-bold text-white text-bold">
                Uživatelský profil
              </Text>
            </View>
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
              <View className="gap-4 mb-8">
                <View>
                  <StyledInput label="Email" value={userInfo.email} disabled />
                </View>
                <View>
                  <StyledInput
                    label="Uživatelské jméno"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                  />
                </View>
              </View>
            </View>
            <View>
              <View className="gap-3">
                {userInfo.username !== username && (
                  <Button
                    variant="primary"
                    title={loading ? "Ukládám ..." : "Uložit"}
                    onPress={() =>
                      updateProfile({
                        username,
                      })
                    }
                    disabled={loading}
                  />
                )}
                <Button
                  variant="secondary"
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
