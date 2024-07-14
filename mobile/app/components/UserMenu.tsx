import { Image, StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { theme } from "../utils/theme";
import { UserAvatarContext } from "../providers/UserAvatar";
import { useContext } from "react";
import { UserInfoContext } from "../providers/UserInfo";

export const UserMenu = () => {
  const { url } = useContext(UserAvatarContext);
  const { userInfo } = useContext(UserInfoContext);
  return (
    <View style={styles.layout}>
      {url && <Image source={{ uri: url }} style={styles.avatar} />}
      <Text style={styles.name}>{userInfo?.username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderColor: theme.red,
    borderWidth: 2,
  },
  layout: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 14,
    gap: 16,
  },
  name: {
    color: theme.grey,
    fontSize: 20,
    fontWeight: "bold",
  },
});
