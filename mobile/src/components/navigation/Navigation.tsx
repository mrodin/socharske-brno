import { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { SearchIcon } from "./SearchIcon";
import { CrownIcon } from "./CrownIcon";
import { JostStatueIcon } from "./JostStatueIcon";
import { MapIcon } from "./MapIcon";
import { UserIcon } from "./UserIcon";
import { router, usePathname } from "expo-router";
import { NavigationButton } from "./NavigationButton";

export const Navigation: FC = () => {
  return (
    <View className="absolute bottom-0 left-0 w-full h-[110px]">
      <View className="relative w-full h-0">
        <View className="absolute top-4 left-0 w-full h-[102px] bg-gray shadow-[0px_-2px_5px_0px_rgba(0,0,0,0.15)]"></View>
      </View>
      <View className="flex flex-row justify-between items-end px-7">
        <NavigationButton label="Do mapy" icon={MapIcon} route="/" />
        <NavigationButton route="/search" label="Hledat" icon={SearchIcon} />
        <NavigationButton
          route="/my-statues"
          label="Moje sochy"
          icon={JostStatueIcon}
          accent
        />
        <NavigationButton
          route="/leaderboard"
          label="Leaderboard"
          icon={CrownIcon}
        />
        <NavigationButton route="/profile" label="Profil" icon={UserIcon} />
      </View>
    </View>
  );
};
