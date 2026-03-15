import { defaultUserIconSource } from "@/utils/images";
import { LinearGradient } from "react-native-linear-gradient";
import { FC } from "react";
import { View, Text, Image } from "react-native";
import { cssInterop } from "nativewind";

const StyledLinearGradient = cssInterop(LinearGradient, {
  className: "style",
});

type CurrentPlayerProps = {
  rank: number;
  username: string;
  score: number;
  avatarUrl: string | null;
};

export const CurrentPlayer: FC<CurrentPlayerProps> = ({
  rank,
  username,
  score,
  avatarUrl,
}) => {
  return (
    <StyledLinearGradient
      colors={["#DF4237", "#D5232A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex flex-row items-center justify-between rounded-2xl px-4 py-2 w-full"
    >
      <View className="flex flex-row items-center gap-2">
        <Text className="text-gray-pale text-center text-lg">{rank}.</Text>
        <View className="flex flex-row items-center gap-2">
          <Image
            source={avatarUrl ? { uri: avatarUrl } : defaultUserIconSource}
            accessibilityLabel="Avatar"
            style={{ width: 32, height: 32 }}
            className="object-cover rounded-full"
          />
          <Text className="text-white text-center text-lg">{username}</Text>
        </View>
      </View>
      <Text className="text-white text-center text-lg">{score} b</Text>
    </StyledLinearGradient>
  );
};
