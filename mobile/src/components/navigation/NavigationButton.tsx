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
  route: "/" | "/search" | "/my-statues" | "/leaderboard" | "/profile";
  label: string;
  icon?: FC;
  accent?: boolean;
};

export const NavigationButton: FC<NavigationButtonProps> = ({
  route,
  label,
  icon,
  accent,
}) => {
  const pathName = usePathname();
  const isActive = pathName === route;
  const Icon = icon;
  return (
    <Pressable
      className="flex flex-col justify-center items-center gap-2"
      onPress={() => router.push(route)}
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
          {Icon && <Icon />}
        </View>
      )}
      <Text
        className="text-gray-pale text-[10px]"
        style={{ opacity: isActive ? 1 : 0.6 }}
      >
        {label}
      </Text>
    </Pressable>
  );
};
