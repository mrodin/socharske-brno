import { Image, View, Text } from "react-native";
import { useContext } from "react";
import { UserAvatarContext } from "../providers/UserAvatar";
import { UserInfoContext } from "../providers/UserInfo";
import { useGetLeaderboard } from "@/api/queries";
import { useUserStatistics } from "@/hooks/useUserStatistics";

export const UserTag = () => {
  const { url } = useContext(UserAvatarContext);
  const { userInfo } = useContext(UserInfoContext);

  const userStatistics = useUserStatistics();

  return (
    <View className="flex-row justify-between items-center border-[2px] w-full border-gray-light rounded-full ">
      <View className="flex-row items-center">
        {url && (
          <Image
            source={{ uri: url }}
            className="w-[54px] h-[54px] rounded-full"
          />
        )}
        <View className="pl-2">
          <Text className="color-white text-2xl font-bold">
            {userInfo?.username}
          </Text>
          <Text className="color-red-pale">{userStatistics?.rank}. místo</Text>
        </View>
      </View>
      <Text className="color-white text-2xl pr-6">
        {userStatistics?.score}b
      </Text>
    </View>
  );
};
