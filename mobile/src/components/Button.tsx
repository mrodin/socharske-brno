import React from "react";
import {
  TouchableOpacityProps,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { tv } from "tailwind-variants";

const button = tv({
  base: "border-solid border-2 text-center rounded-full gap-x-3 justify-center flex-row items-center",
  variants: {
    variant: {
      primary: "bg-red-light border-red-light",
      secondary: "border-red-lightest",
      regular: "bg-white border-transparent",
    },
  },
  defaultVariants: {
    variant: "regular",
  },
});

const buttonText = tv({
  base: "text-center text-xl font-semibold leading-[48px]",
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-red-lightest",
      regular: "",
    },
  },
});

export const Button = ({
  title,
  icon,
  variant = "regular",
  ...props
}: {
  title: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "regular";
} & TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={[props.disabled && { opacity: 0.5 }]}
      {...props}
    >
      <View className={button({ variant })}>
        {icon}
        <Text className={buttonText({ variant })}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
