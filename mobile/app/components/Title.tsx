import { FC } from "react";
import { TextProps, Text } from "react-native";

type TitleProps = TextProps;

export const Title: FC<TitleProps> = ({ children, ...props }) => (
  <Text className="text-2xl font-bold color-gray" {...props}>
    {children}
  </Text>
);
