import { FC, ReactNode } from "react";
import { theme } from "../utils/theme";
import { View, Text } from "react-native";

type LabelProps = {
  children: ReactNode;
  backgroundColor?: string;
  stroke?: number;
  strokeColor?: string;
  fontColor?: string;
};

export const Label: FC<LabelProps> = ({
  children,
  backgroundColor = "transparent",
  stroke = 1,
  strokeColor = theme.grey,
  fontColor = theme.grey,
}) => (
  <View
    className={`border-[${strokeColor}] border-[${stroke}px] bg-[${backgroundColor}] rounded-full px-4 py-2`}
  >
    <Text className={`text-[12px] text-[${fontColor}]`}>{children}</Text>
  </View>
);
