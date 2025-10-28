import { createContext, ReactNode, useContext, useState } from "react";
import { LocationContext } from "./LocationProvider";
import { DEFAULT_ZOOM } from "@/utils/constants";

export const WizardProviderContext = createContext<{
  step: number | null;
  setStep: (step: number | null) => void;
  show: () => void;
  close: () => void;
}>({
  step: 0,
  setStep: () => {},
  show: () => {},
  close: () => {},
});

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<null | number>(null);
  const { setSearchRegion } = useContext(LocationContext);

  const handleSetStep = (step: number | null) => {
    if (step === 2) {
      // Go to Statue detail
      if (statueWizardDetail) {
        setSearchRegion({
          latitude: statueWizardDetail.lat,
          longitude: statueWizardDetail.lng,
          latitudeDelta: DEFAULT_ZOOM,
          longitudeDelta: DEFAULT_ZOOM,
        });
      }
    }
    setStep(step);
  };

  const show = () => setStep(1);
  const close = () => setStep(null);

  return (
    <WizardProviderContext.Provider
      value={{ setStep: handleSetStep, step, show, close }}
    >
      {children}
    </WizardProviderContext.Provider>
  );
}

const statueWizardDetail = {
  lat: 49.1922483,
  lng: 16.6095605,
};
