import { StyleSheet } from "react-native";
import { Image } from "../primitives/Image";
import { View } from "../primitives/View";
import { Text } from "../primitives/Text";
import { UserAvatarContext } from "../providers/UserAvatar";
import { useContext } from "react";
import { UserInfoContext } from "../providers/UserInfo";

export const UserMenu = () => {
  const { url } = useContext(UserAvatarContext);
  const { userInfo } = useContext(UserInfoContext);
  return (
    <View className="flex flex-row justify-center items-center gap-[15px]">
      <View className="w-[47px] h-[47px] justify-start items-start flex  bg-gray-light rounded-[25px]">
        {url && (
          <Image
            source={{ uri: url }}
            className="w-[47px] h-[47px] grow shrink basis-0 self-stretch rounded-[25px] shadow-inner"
          />
        )}
      </View>
      <Text className="text-gray-pale text-[22px] font-bold leading-snug">
        {userInfo?.username}
      </Text>
    </View>
  );
};
