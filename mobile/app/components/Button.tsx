import React from "react";
import { TouchableOpacity, ButtonProps } from "react-native";

import { styled } from "nativewind";
import { Text } from "../primitives/Text";

const StyledTouchableOpacity = styled(TouchableOpacity);

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
  let touchableStyle =
    "text-center rounded-full p-2 gap-x-2 justify-center flex-row ";
  let textStyle = "text-center text-base";

  if (variant === "primary") {
    touchableStyle += " bg-red-500";
    textStyle += " text-white";
  } else if (variant === "secondary") {
    touchableStyle += " border-solid border-2 border-red-500";
    textStyle += " text-red-500";
  } else {
    touchableStyle += " bg-white";
  }

  return (
    <StyledTouchableOpacity className={touchableStyle} {...props}>
      {icon}
      <Text className={textStyle}>{title}</Text>
    </StyledTouchableOpacity>
  );
};
