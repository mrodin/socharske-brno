import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "../utils/theme";

export const UserTag = () => (
  <View style={styles.layout}>
    <Image
      source={require("../../assets/images/pepe.jpeg")}
      style={styles.avatar}
    />
    <Text style={styles.name}>Petr Pololáník</Text>
  </View>
);

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
