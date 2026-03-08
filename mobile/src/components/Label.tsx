import { FC, ReactNode } from "react";
import { View, Text } from "react-native";

type LabelProps = {
  children: ReactNode;
};

export const Label: FC<LabelProps> = ({ children }) => (
  <View
    className={`border-white border-[2px] color-white bg- rounded-full px-2 py-0`}
  >
    <Text className={`text-lg text-white`}>{children}</Text>
  </View>
);
