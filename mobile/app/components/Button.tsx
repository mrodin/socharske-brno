import React from "react";
import { TouchableOpacity, ButtonProps } from "react-native";

import { styled } from "nativewind";
import { Text } from "../primitives/Text";

const StyledTouchableOpacity = styled(TouchableOpacity);

const touchableStyle =
  "text-center rounded-full p-2 gap-x-2 justify-center flex-row ";
const textStyle = "text-center text-base ";

const toucbleStyleExtenstion = {
  primary: "bg-red-500",
  secondary: "border-solid border-2 border-red-500",
  regular: "bg-white",
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
} & ButtonProps) => {
  return (
    <StyledTouchableOpacity
      className={touchableStyle + toucbleStyleExtenstion[variant]}
      {...props}
    >
      {icon}
      <Text className={textStyle + textStyleExtension[variant]}>{title}</Text>
    </StyledTouchableOpacity>
  );
};
