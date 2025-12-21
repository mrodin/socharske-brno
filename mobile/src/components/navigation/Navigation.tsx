import { FC } from "react";
import { View } from "react-native";
import { SearchIcon } from "./SearchIcon";
import { CrownIcon } from "./CrownIcon";
import { JostStatueIcon } from "./JostStatueIcon";
import { UserIcon } from "./UserIcon";
import { NavigationButton } from "./NavigationButton";
import { MyStatuesIcon } from "./MyStatuesIcon";
import { cn } from "@/utils/cn";

export type NavigationRoute =
  | "/"
  | "/search"
  | "/my-statues"
  | "/leaderboard"
  | "/profile";

type NavigationProps = {
  onPress: (routeName: NavigationRoute) => void;
  selectedRoute: NavigationRoute | null;
  disabled?: boolean;
  className?: string;
};

export const Navigation: FC<NavigationProps> = ({
  onPress,
  selectedRoute,
  disabled,
  className,
}) => {
  return (
    <View
      className={cn("absolute bottom-0 left-0 w-full h-[110px]", className)}
    >
      <View className="relative w-full h-0">
        <View className="absolute top-4 left-0 w-full h-[102px] bg-gray shadow-[0px_-2px_5px_0px_rgba(0,0,0,0.15)]"></View>
      </View>
      <View className="flex flex-row justify-between items-end px-7">
        <NavigationButton
          disabled={disabled}
          label="Hledat"
          onPress={() => onPress("/search")}
          icon={SearchIcon}
          isActive={selectedRoute === "/search"}
        />
        <NavigationButton
          disabled={disabled}
          label="Moje sochy"
          icon={MyStatuesIcon}
          onPress={() => onPress("/my-statues")}
          isActive={selectedRoute === "/my-statues"}
        />
        <NavigationButton
          disabled={disabled}
          label="Do mapy"
          icon={JostStatueIcon}
          onPress={() => onPress("/")}
          accent
          isActive={selectedRoute === "/"}
        />
        <NavigationButton
          disabled={disabled}
          label="Hráči"
          icon={CrownIcon}
          onPress={() => onPress("/leaderboard")}
          isActive={selectedRoute === "/leaderboard"}
        />
        <NavigationButton
          disabled={disabled}
          label="Profil"
          icon={UserIcon}
          onPress={() => onPress("/profile")}
          isActive={selectedRoute === "/profile"}
        />
      </View>
    </View>
  );
};
