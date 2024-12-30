import { FC } from "react";
import { Image, Text, StyleSheet, View } from "react-native";
import { theme } from "../utils/theme";

type WinnerProps = {
  name: string;
  score: string;
  thumbnail: any;
};

export const Winner: FC<WinnerProps> = ({ name, thumbnail, score }) => {
  return (
    <View style={styles.entry}>
      <Image source={thumbnail} style={styles.avatar} />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
        {name}
      </Text>
      <Text style={styles.text}>{`${score} b`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    height: 54,
    width: 54,
  },
  entry: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.red,
    borderRadius: 50,
    paddingLeft: 6,
    paddingRight: 12,
  },
  text: {
    fontSize: 22,
    color: theme.white,
    maxWidth: 200,
  },
});
