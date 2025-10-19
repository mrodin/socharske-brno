import React, { FC } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { tv } from "tailwind-variants";

const checkboxBox = tv({
  base: "w-6 h-6 border-2 border-white rounded justify-center items-center",
  variants: {
    checked: {
      true: "bg-red-light border-red-light",
      false: "bg-transparent",
    },
  },
});

type CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  label?: string;
};

export const Checkbox: FC<CheckboxProps> = ({ checked, onPress, label }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-start gap-2"
    activeOpacity={1}
  >
    <View className={checkboxBox({ checked })}>
      {checked && <Text className="text-white text-[16px] font-bold">✓</Text>}
    </View>
    {label && <Text className="text-white leading-6 text-[16px] flex-1 -mt-1">{label}</Text>}
  </TouchableOpacity>
);
