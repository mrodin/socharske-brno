import { createContext, ReactNode, useState } from "react";
import { useLocationContext } from "./LocationProvider";
import { noop } from "@/utils/constants";

export const WizardProviderContext = createContext<{
  step: number | null;
  setStep: (step: number | null) => void;
  show: () => void;
  close: () => void;
}>({
  step: 0,
  setStep: noop,
  show: noop,
  close: noop,
});

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<null | number>(null);
  const { animateToRegion } = useLocationContext();

  const handleSetStep = (step: number | null) => {
    if (step === 2) {
      // Go to Statue detail
      if (statueWizardDetail) {
        animateToRegion({
          latitude: statueWizardDetail.lat,
          longitude: statueWizardDetail.lng,
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
