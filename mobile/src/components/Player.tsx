import { FC } from "react";
import { Image, Text, View } from "react-native";
import { tv } from "tailwind-variants";

type PlayerProps = {
  isWinner: boolean;
  name: string;
  score: string;
  thumbnail: string | any;
};

export const Player: FC<PlayerProps> = ({
  isWinner,
  name,
  score,
  thumbnail,
}) => {
  return (
    <View className={player({ isWinner })}>
      <Image
        source={{
          uri: thumbnail,
        }}
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
