import React from "react";
import { TouchableOpacityProps } from "react-native";

import { styled } from "nativewind";
import { Text } from "../primitives/Text";
import { TouchableOpacity } from "../primitives/TouchableOpacity";

const touchableStyle =
  "border-solid border-2 text-center rounded-full gap-x-2 justify-center flex-row items-center ";
const textStyle = "text-center text-base leading-[48px] ";

const toucbleStyleExtenstion = {
  primary: "bg-red-500 border-red-500",
  secondary: "border-red-500",
  regular: "bg-white border-transparent",
};

const textStyleExtension = {
  primary: "text-white",
  secondary: "text-red-500",
  regular: "",
};

export const Button = ({
  title,
  icon,
  variant = "regular",
  ...props
}: {
  title: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "regular";
} & TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      className={touchableStyle + toucbleStyleExtenstion[variant]}
      {...props}
    >
      {icon}
      <Text className={textStyle + textStyleExtension[variant]}>{title}</Text>
    </TouchableOpacity>
  );
};
