import { FC } from "react";
import { TextProps, Text } from "react-native";

type TitleProps = TextProps;

export const Title: FC<TitleProps> = ({ children, className, ...props }) => (
  <Text
    className={"text-2xl text-gray-pale text-[20px] tracking-wide " + className}
    {...props}
  >
    {children}
  </Text>
);
