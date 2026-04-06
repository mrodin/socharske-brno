import { defaultUserIconSource } from "@/utils/images";
import { FC } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { tv } from "tailwind-variants";

type PlayerProps = {
  rank?: number;
  name: string;
  score?: string;
  avatarUrl: string | null;
  onPress?: () => void;
};

export const Player: FC<PlayerProps> = ({
  rank,
  name,
  score,
  avatarUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex flex-row items-center justify-between rounded-2xl px-4 py-2 w-full">
        <View className="flex flex-row items-center gap-2">
          {rank !== undefined && (
            <Text className="text-gray-pale text-center text-lg">{rank}.</Text>
          )}
          <View className="flex flex-row items-center gap-2">
            <Image
              source={avatarUrl ? { uri: avatarUrl } : defaultUserIconSource}
              accessibilityLabel="Avatar"
              style={{ width: 32, height: 32 }}
              className="object-cover rounded-full"
            />
            <Text className="text-white text-center text-lg">{name}</Text>
          </View>
        </View>
        {score !== undefined && (
          <Text className="text-white text-center text-lg">{score} b</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const player = tv({
  base: "h-[60px] flex-row gap-6 justify-between items-center rounded-full pl-1.5 pr-6",
  variants: {
    isWinner: {
      true: "bg-red-light",
      false: "bg-gray-light",
    },
  },
});
