import { FC } from "react";
import { View, Text, Image } from "react-native";

type ProfileDetailProps = {
  username?: string;
  avatarUrl: string | null;
  collectedStatuesCount: number;
  score: number;
  rank: number;
};

export const ProfileDetail: FC<ProfileDetailProps> = ({
  username,
  rank,
  avatarUrl,
  collectedStatuesCount,
  score,
}) => {
  return (
    <>
      <View className="flex-col justify-center items-center gap-4">
        {username && (
          <Text className="text-white w-full text-center font-bold text-3xl">
            {username}
          </Text>
        )}
        <View className="border-solid border-2 rounded-full border-red-light">
          <Text className="color-red-light px-[5px] py-[3px] font-bold">
            {rank}. místo
          </Text>
        </View>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require("../../assets/images/spravedlnost.png")
          }
          accessibilityLabel="Avatar"
          style={{ width: 180, height: 180 }}
          className="object-cover rounded-full"
        />
      </View>

      <View className="gap-3 flex-row w-full pt-[30px]">
        <View className="bg-gray-light flex-1 rounded-2xl px-3 py-4 gap-1">
          <Text className="text-white">Ulovené sochy</Text>
          <Text className="text-4xl font-bold text-white">
            {collectedStatuesCount}
          </Text>
        </View>
        <View className="bg-gray-light flex-1 rounded-2xl px-3 py-4 gap-1">
          <Text className="text-white">Skóre</Text>
          <Text className="text-4xl font-bold text-white">{score}b</Text>
        </View>
      </View>
    </>
  );
};
