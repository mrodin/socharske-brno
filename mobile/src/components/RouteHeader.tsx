import { Link } from "expo-router";
import { FC } from "react";
import { Text, Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type RouteHeaderProps = {
  route: string;
};

export const RouteHeader: FC<RouteHeaderProps> = ({ route }) => {
  return (
    <View className="flex flex-row items-center gap-2 w-full justify-start">
      <Link href="/" asChild>
        <Pressable>
          <Svg width="20" height="36" viewBox="0 0 20 36" fill="none">
            <Path
              d="M18 2L2 18L18 34"
              stroke="#FDF2F2"
              strokeWidth="4"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </Link>
      <Text className="text-gray-pale text-[20px] absolute left-1/2 -translate-x-1/2 tracking-wide">
        {route}
      </Text>
    </View>
  );
};
