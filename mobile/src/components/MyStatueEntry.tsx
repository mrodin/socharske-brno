import { FC } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { theme } from "../utils/theme";
import Svg, { Path } from "react-native-svg";
import { format } from "date-fns";

type MyStatueEntryProps = {
  name: string;
  thumbnail: string;
  createdAt: string;
};

export const MyStatueEntry: FC<MyStatueEntryProps> = ({
  name,
  thumbnail,
  createdAt,
}) => {
  return (
    <View style={styles.entry}>
      <Image source={{ uri: thumbnail }} style={styles.avatar} />
      <View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="color-white text-2xl  max-w-[200px]"
        >
          {name}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" className="color-red-pale">
          uloveno {format(new Date(createdAt), "dd.MM.yyyy")}
        </Text>
      </View>
      <Svg width={10} height={18} viewBox="0 0 10 18" fill="none">
        <Path
          d="M1 17L9 9L1 1"
          stroke="#FEFBFB"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
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
