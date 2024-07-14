import { StyleSheet } from "react-native";
import { Image } from "./Image";
import { View } from "./View";
import { Text } from "./Text";
import { theme } from "../utils/theme";

export const UserMenu = ({userName = "Petr Pololáník"}) => (
  <View className="flex flex-row justify-center items-center gap-[15px]">
    <View className="w-[47px] h-[47px] justify-start items-start flex">
      <Image
        source={require("../../assets/images/pepe.jpeg")}
        className="w-[47px] h-[47px] grow shrink basis-0 self-stretch rounded-[25px] shadow-inner"
      />
    </View>
    <Text className="text-gray-200 text-[22px] font-bold leading-snug">{userName}</Text>
  </View>
);

