import { Image, StyleSheet, View } from "react-native";
import { Text } from "../primitives/Text";
import { theme } from "../utils/theme";
import { useContext } from "react";
import { UserAvatarContext } from "../providers/UserAvatar";
import { UserInfoContext } from "../providers/UserInfo";

export const UserTag = () => {
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
    width: 33,
    height: 33,
    borderRadius: 50,
  },
  layout: {
    backgroundColor: theme.grey,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 14,
    gap: 16,
  },
  name: {
    color: theme.white,
    fontSize: 12,
  },
});
