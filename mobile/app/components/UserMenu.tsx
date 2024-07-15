import { StyleSheet } from "react-native";
import { Image } from "./Image";
import { View } from "./View";
import { Text } from "./Text";
import { UserAvatarContext } from "../providers/UserAvatar";
import { useContext } from "react";
import { UserInfoContext } from "../providers/UserInfo";

export const UserMenu = () => {
  const { url } = useContext(UserAvatarContext);
  const { userInfo } = useContext(UserInfoContext);
  return (
    <View className="flex flex-row justify-center items-center gap-[15px]">
      <View className="w-[47px] h-[47px] justify-start items-start flex">
        {url && (
          <Image
            source={{ uri: url }}
            className="w-[47px] h-[47px] grow shrink basis-0 self-stretch rounded-[25px] shadow-inner"
          />
        )}
      </View>
      <Text className="text-gray-200 text-[22px] font-bold leading-snug">
        {userInfo?.username}
      </Text>
    </View>
  );
};
