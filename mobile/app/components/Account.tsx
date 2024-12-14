import { useState, useEffect, useContext } from "react";
import { supabase } from "../utils/supabase";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import Avatar from "./Avatar";
import { Input } from "../primitives/Input";
import { UserInfoContext } from "../providers/UserInfo";
import { View } from "./View";

export default function Account() {
  const { userInfo, updateProfile, loading } = useContext(UserInfoContext);
  const [username, setUsername] = useState("");

  if (!userInfo) return null;

  useEffect(() => {
    setUsername(userInfo.username);
  }, [userInfo]);

  return (
    <View className="w-ful h-full bg-gray px-8">
      <View>
        <Avatar
          size={200}
          onUpload={(url: string) => {
            updateProfile({
              avatar_url: url,
            });
          }}
        />
      </View>
      <View className="flex gap-y-4">
        <Input label="E-mail" value={userInfo.email} disabled />
        <Input
          label="Uživatelské jméno"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />

        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({
              username,
            })
          }
          disabled={loading}
        />
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}
