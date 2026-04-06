import { defaultUserIconSource } from "@/utils/images";
import { FC } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { tv } from "tailwind-variants";
import { FollowProfileButton } from "../FollowProfileButton";

type PlayerProps = {
  rank?: number;
  name: string;
  score?: string;
  avatarUrl: string | null;
  isFollowing: boolean;
  onProfilePress: () => void;
  onToggleFollowPress: () => void;
};

export const SearchedPlayer: FC<PlayerProps> = ({
  name,
  avatarUrl,
  isFollowing,
  onProfilePress,
  onToggleFollowPress,
}) => {
  return (
    <View className="flex flex-row items-center justify-between rounded-2xl px-4 py-2 w-full">
      <TouchableOpacity onPress={onProfilePress}>
        <View className="flex flex-row items-center gap-2">
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
      </TouchableOpacity>
      <FollowProfileButton
        className="bg-transparent"
        onPress={onToggleFollowPress}
        isFollowing={isFollowing}
      />
    </View>
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
