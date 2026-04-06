import { defaultUserIconSource } from "@/utils/images";
import { FC } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { tv } from "tailwind-variants";

const variants = tv({
  slots: {
    image: "object-cover rounded-full",
    avatarWrapper: "relative",
    rankWrapper:
      "absolute flex flex-grow-0 items-center justify-center rounded-full w-[20px] h-[20px] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2",
    rankText: "font-bold text-white font-corona",
  },
  variants: {
    rank: {
      1: {
        avatarWrapper: "",
        image: "border-4 border-yellow-400",
        rankWrapper: "bg-yellow-400 mt-[-16px]",
      },
      2: {
        avatarWrapper: "scale-90",
        image: "border-4 border-[#A7A7AD]",
        rankWrapper: "bg-[#A7A7AD] mt-[-20px]",
      },
      3: {
        avatarWrapper: "scale-[0.8]",
        image: "border-4 border-yellow-700",
        rankWrapper: "bg-yellow-700 mt-[-24px]",
      },
    },
  },
});

type TopPlayerProps = {
  username: string;
  avatarUrl: string | null;
  rank: 1 | 2 | 3;
  score: number;
  onPress: () => void;
};

export const TopPlayer: FC<TopPlayerProps> = ({
  username,
  rank,
  avatarUrl,
  score,
  onPress,
}) => {
  const { image, rankWrapper, rankText, avatarWrapper } = variants({ rank });
  return (
    <View className="flex-1 flex flex-col items-center gap-1 overflow-hidden">
      <TouchableOpacity
        onPress={onPress}
        className="flex flex-col items-center gap-1"
      >
        <View className={avatarWrapper()}>
          <Image
            source={avatarUrl ? { uri: avatarUrl } : defaultUserIconSource}
            accessibilityLabel="Avatar"
            style={{ width: 112, height: 112 }}
            className={image()}
          />
          <View className={rankWrapper()}>
            <Text className={rankText()}>{rank}</Text>
          </View>
        </View>
        <View className="w-full overflow-hidden">
          <Text className="text-white text-center text-lg leading-0 truncate">
            {username}
          </Text>
        </View>
      </TouchableOpacity>
      <Text className="text-gray-lighter w-full text-center font-medium text-md truncate">
        {score} b
      </Text>
    </View>
  );
};
