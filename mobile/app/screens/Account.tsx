import { useState, useEffect, useContext } from "react";
import { supabase } from "../utils/supabase";
import Avatar from "../components/Avatar";
import { UserInfoContext } from "../providers/UserInfo";
import { Text } from "../primitives/Text";
import { View } from "../primitives/View";
import { StyledInput } from "../components/StyledInput";
import { Button } from "../components/Button";
import { ArrowLeft } from "../icons/ArrowLeft";
import { TouchableOpacity } from "../primitives/TouchableOpacity";
import { SafeAreaView, ScrollView } from "react-native";

type AccountProps = { onClickBack: () => void };

export const Account = ({ onClickBack }: AccountProps) => {
  const { userInfo, updateProfile, loading } = useContext(UserInfoContext);
  const [username, setUsername] = useState("");

  if (!userInfo) return null;

  useEffect(() => {
    setUsername(userInfo.username);
  }, [userInfo]);

  return (
    <View className="bg-my-gray h-full w-full p-5 pt-[20px]">
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
                  <StyledInput
                    label="Email"
                    className="bg-white px-5 py-3 rounded-full border-none"
                    value={userInfo.email}
                    disabled
                  />
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
                  onPress={() => supabase.auth.signOut()}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
