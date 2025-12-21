import { Image, View, Text } from "react-native";
import { useContext } from "react";
import { UserAvatarContext } from "../providers/UserAvatar";
import { UserInfoContext } from "../providers/UserInfo";
import { useGetLeaderboard } from "@/api/queries";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import { defaultUserIconSource } from "@/utils/images";

export const UserTag = () => {
  const { url } = useContext(UserAvatarContext);
  const { userInfo } = useContext(UserInfoContext);

  const userStatistics = useUserStatistics();

  return (
    <View className="flex-row justify-between items-center border-[2px] w-full border-gray-light rounded-full gap-2.5">
      <Image
        source={
          url
            ? {
                uri: url,
              }
            : defaultUserIconSource
        }
        className="w-[54px] h-[54px] rounded-full"
      />
      <View className="py-2 flex-1">
        <Text
          className="color-white text-2xl font-bold"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {userInfo?.username}
        </Text>
        <Text className="color-red-pale">{userStatistics?.rank}. místo</Text>
      </View>
      <Text className="color-white text-2xl pr-6">
        {userStatistics?.score}b
      </Text>
    </View>
  );
};
