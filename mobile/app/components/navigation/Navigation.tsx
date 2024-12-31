import { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { SearchIcon } from "./SearchIcon";
import { CrownIcon } from "./CrownIcon";
import { JostStatueIcon } from "./JostStatueIcon";
import { CogIcon } from "./CogIcon";
import { UserIcon } from "./UserIcon";

type NavigationProps = {
  onSearchOpen: () => void;
  onSelect: (id: string) => void;
};

export const Navigation: FC<NavigationProps> = ({ onSelect, onSearchOpen }) => {
  return (
    <View className="absolute bottom-0 left-0 w-full h-[110px]">
      <View className="relative w-full h-0">
        <View className="absolute top-4 left-0 w-full h-[102px] bg-gray shadow-[0px_-2px_5px_0px_rgba(0,0,0,0.15)]"></View>
      </View>
      <View className="flex flex-row justify-between items-end px-7">
        <NavigationButton
          label="Hledat"
          icon={SearchIcon}
          onPress={() => onSearchOpen()}
        />
        <NavigationButton
          label="Leaderboard"
          icon={CrownIcon}
          onPress={() => onSelect("leaderBoard")}
        />
        <NavigationButton
          label="Moje sochy"
          icon={JostStatueIcon}
          accent
          onPress={() => onSelect("myStatues")}
        />
        <NavigationButton
          label="Nastatvení"
          icon={CogIcon}
          onPress={() => onSelect("settings")}
        />
        <NavigationButton
          label="Profil"
          icon={UserIcon}
          onPress={() => onSelect("settings")}
        />
      </View>
    </View>
  );
};

type NaveigationButtonProps = {
  label: string;
  icon?: FC;
  accent?: boolean;
  onPress: () => void;
};

const NavigationButton: FC<NaveigationButtonProps> = ({
  label,
  icon,
  accent,
  onPress,
}) => {
  const Icon = icon;
  return (
    <Pressable
      className="flex flex-col justify-center items-center gap-2"
      onPress={onPress}
    >
      {accent ? (
        <View className="w-[68px] h-[68px] bg-red rounded-full flex justify-center items-center shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)]">
          {Icon && <Icon />}
        </View>
      ) : (
        <View className="w-[50px] h-[50px] flex justify-end items-center">
          {Icon && <Icon />}
        </View>
      )}
      <Text className="text-gray-lighter text-[10px] ">{label}</Text>
    </Pressable>
  );
};
