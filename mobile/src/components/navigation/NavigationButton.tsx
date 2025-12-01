import { cn } from "@/utils/cn";
import { router, usePathname } from "expo-router";
import { FC } from "react";
import { Pressable, View, Text } from "react-native";
import { tv } from "tailwind-variants";

// TODO implement shadows shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)]
// https://www.nativewind.dev/docs/tailwind/effects/box-shadow#compatibility
const accentButtonVariants = tv({
  base: "w-[68px] h-[68px] rounded-full flex justify-center items-center",
  variants: {
    isActive: {
      true: "bg-red",
      false: "bg-red-light",
    },
  },
});

type NavigationButtonProps = {
  label: string;
  icon?: FC<{ color?: string }>;
  accent?: boolean;
  disabled?: boolean;
  isActive: boolean;
  onPress: () => void;
};

export const NavigationButton: FC<NavigationButtonProps> = ({
  label,
  icon,
  accent,
  disabled,
  isActive,
  onPress,
}) => {
  const Icon = icon;

  return (
    <Pressable
      className="flex flex-col justify-center items-center gap-2"
      disabled={disabled}
      onPress={onPress}
    >
      {accent ? (
        <View className={accentButtonVariants({ isActive })}>
          {Icon && <Icon />}
        </View>
      ) : (
        <View
          className="w-[50px] h-[50px] flex justify-end items-center"
          style={{ opacity: isActive ? 1 : 0.5 }}
        >
          {Icon && (
            <Icon
              color={
                isActive ? "rgba(223, 66, 55, 1)" : "rgba(209, 209, 209, 1)" // Tailwind --color values not working here
              }
            />
          )}
        </View>
      )}
      <Text
        className={cn(
          "text-gray-pale text-[10px]",
          isActive ? "text-red-light" : "text-gray-lighter"
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
};
