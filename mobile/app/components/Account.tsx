import { useState, useEffect, useContext } from "react";
import { supabase } from "../utils/supabase";
import { StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Avatar from "./Avatar";
import { UserInfoContext } from "../providers/UserInfo";

export default function Account() {
  const { userInfo, updateProfile, loading } = useContext(UserInfoContext);
  const [username, setUsername] = useState("");

  if (!userInfo) return null;

  useEffect(() => {
    setUsername(userInfo.username);
  }, [userInfo]);

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={userInfo.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

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

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({
              username,
            })
          }
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
