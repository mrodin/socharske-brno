import {
  Navigation,
  NavigationRoute,
} from "@/components/navigation/Navigation";
import { View } from "react-native";
import WizardComponent from "@/components/WizardSteps";
import { Map } from "@/components/Map";
import { useContext } from "react";
import { WizardProviderContext } from "@/providers/WizardProvider";

const getActiveRouteByStep = (step: number): NavigationRoute | null => {
  switch (step) {
    case 3:
      return "/my-statues";
    case 4:
      return "/search";
    case 5:
      return "/profile";
    default:
      return null;
  }
};

export const Wizard = () => {
  const { step } = useContext(WizardProviderContext);

  if (step === null) {
    return null;
  }

  return (
    <View className={`bg-gray left-0 w-full h-full`}>
      <View className={step > 2 ? "opacity-50" : ""}>
        <Map />
      </View>
      <View className="absolute bottom-0 w-full">
        <Navigation
          onPress={() => {}}
          selectedRoute={getActiveRouteByStep(step)}
        />
      </View>
      {step < 3 && <Overlay />}
      <View className={`w-full h-full pb-[96px] absolute top-0 left-0`}>
        <WizardComponent />
      </View>
    </View>
  );
};

const Overlay = () => (
  <View className="absolute left-0 bottom-0 w-full h-full bg-gray opacity-50" />
);
