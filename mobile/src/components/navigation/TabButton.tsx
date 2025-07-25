import { TabTriggerSlotProps } from "expo-router/ui";
import { ComponentProps, forwardRef } from "react";
import { Text, Pressable, View } from "react-native";
import { tv } from "tailwind-variants";

const accentButtonVariants = tv({
  base: "w-[68px] h-[68px] rounded-full flex justify-center items-center",
  variants: {
    isActive: {
      true: "bg-red",
      false: "bg-red-light",
    },
  },
});

export type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon?: React.ComponentType;
  accent?: boolean;
};

export const TabButton = forwardRef<View, TabButtonProps>(
  ({ icon, label, accent, isFocused, style, ...props }, ref) => {
    const Icon = icon;

    return (
      <Pressable
        {...props}
        ref={ref}
        className="flex flex-col justify-center items-center gap-2"
      >
        {accent ? (
          <View className={accentButtonVariants({ isActive: isFocused })}>
            {Icon && <Icon />}
          </View>
        ) : (
          <View
            className="w-[50px] h-[50px] flex justify-end items-center"
            style={{ opacity: isFocused ? 1 : 0.5 }}
          >
            {Icon && <Icon />}
          </View>
        )}
        <Text
          className="text-gray-pale text-[10px]"
          style={{ opacity: isFocused ? 1 : 0.6 }}
        >
          {label}
        </Text>
      </Pressable>
    );
  }
);

TabButton.displayName = "TabButton";
