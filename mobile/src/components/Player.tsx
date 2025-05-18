import { FC } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { tv } from "tailwind-variants";

type PlayerProps = {
  isWinner: boolean;
  name: string;
  score: string;
  thumbnail: string | any;
  onPress?: () => void;
};

export const Player: FC<PlayerProps> = ({
  isWinner,
  name,
  score,
  thumbnail,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className={player({ isWinner })}>
        <Image
          source={
            thumbnail
              ? {
                  uri: thumbnail,
                }
              : require("../../assets/images/spravedlnost.png")
          }
          className="h-[52px] w-[52px] rounded-full"
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-[22px] text-white max-w-[180px]"
        >
          {name}
        </Text>
        <Text className="text-[22px] text-white">{`${score} b`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const player = tv({
  base: "h-[60px] flex-row justify-between items-center rounded-full pl-1.5 pr-6",
  variants: {
    isWinner: {
      true: "bg-red-light",
      false: "bg-gray-light",
    },
  },
});
