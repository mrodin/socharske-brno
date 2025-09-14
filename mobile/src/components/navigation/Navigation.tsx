import { FC, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { SearchIcon } from "./SearchIcon";
import { CrownIcon } from "./CrownIcon";
import { JostStatueIcon } from "./JostStatueIcon";
import { MapIcon } from "./MapIcon";
import { UserIcon } from "./UserIcon";
import { NavigationButton } from "./NavigationButton";
import { WizardProviderContext } from "@/providers/WizardProvider";
import { tv } from "tailwind-variants";

const wrapVariant = tv({
  base: "absolute bottom-0 left-0 w-full h-[110px]",
  variants: {
    isTransparent: {
      true: "opacity-50",
      false: "opacity-100",
    },
  },
});

export const Navigation: FC = () => {
  const { step: wizardStep } = useContext(WizardProviderContext);
  const showWizard = wizardStep !== null;
  return (
    <View
      className={wrapVariant({
        isTransparent: showWizard && wizardStep < 3,
      })}
    >
      <View className="relative w-full h-0">
        <View className="absolute top-4 left-0 w-full h-[102px] bg-gray shadow-[0px_-2px_5px_0px_rgba(0,0,0,0.15)]"></View>
      </View>
      <View className="flex flex-row justify-between items-end px-7">
        <NavigationButton
          disabled={showWizard}
          label="Do mapy"
          icon={MapIcon}
          route="/"
        />
        <NavigationButton
          disabled={showWizard}
          route="/search"
          label="Hledat"
          icon={SearchIcon}
        />
        <NavigationButton
          disabled={showWizard}
          route="/my-statues"
          label="Moje sochy"
          icon={JostStatueIcon}
          accent
        />
        <NavigationButton
          disabled={showWizard}
          route="/leaderboard"
          label="Leaderboard"
          icon={CrownIcon}
        />
        <NavigationButton route="/profile" label="Profil" icon={UserIcon} />
      </View>
    </View>
  );
};
