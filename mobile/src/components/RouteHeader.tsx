import { FC } from "react";
import { Text, View } from "react-native";

type RouteHeaderProps = {
  route: string;
};

export const RouteHeader: FC<RouteHeaderProps> = ({ route }) => {
  return (
    <View className="flex flex-row justify-start pt-4 pb-3 border-b-[#333] border-b-[1px] mb-4">
      <Text className="text-gray-pale text-[17px]  left-1/2 -translate-x-1/2 tracking-wide ">
        {route}
      </Text>
    </View>
  );
};
