import { FC, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Button } from "@/components/Button";
import { ArrowRight } from "@/icons/ArrowRight";
import { WizardProviderContext } from "@/providers/WizardProvider";
import { Close } from "@/icons/Close";

type TooltipProps = {
  onNext: () => void;
};

const WizardArrow: FC<{ className: string }> = ({ className }) => (
  <View className={"absolute w-1 h-1 " + className}>
    <View className=" bg-white w-[20px] h-[20px] ml-[-10px] mt-[-10px] rotate-45 "></View>
  </View>
);

const CloseButton: FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Pressable
      className="absolute top-4 right-4"
      onPress={() => {
        onClose();
      }}
    >
      <Close width={10} height={10} color="#DF4237" />
    </Pressable>
  );
};

const Next: FC<{ onPress: () => void; text: string }> = ({ onPress, text }) => (
  <Pressable
    className="self-end pt-4 pb-4 flex-row items-center"
    onPress={onPress}
  >
    <Text className="color-red">{text} </Text>
    <ArrowRight className="ml-1" color="#DF4237" width={8} height={12} />
  </Pressable>
);

const WizardWrapper: FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const { setStep } = useContext(WizardProviderContext);
  const handleClose = () => {
    setStep(null);
  };
  return (
    <View
      className={
        "absolute bg-white w-[280px] gap-3 p-5 rounded-xl " + className
      }
    >
      <CloseButton onClose={handleClose} />
      {children}
    </View>
  );
};

const Header: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text className="text-xl font-bold">{children}</Text>
);

const Description: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text className="text-base">{children}</Text>
);

const StepNumber = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-lg -mt-2 font-light">{children}</Text>
);

export const TooltipStep1: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="my-auto mx-auto relative z-40">
      <Header>Vydej se na lov soch!</Header>
      <Description>
        Objevuj Brno z nového úhlu pohledu. Sbírej sochy a soutěž s ostatními v
        počtu ulovených soch.
      </Description>
      <Button
        variant="primary"
        className="mt-2"
        title="Jdu na to!"
        onPress={onNext}
      />
    </WizardWrapper>
  </>
);

const TooltipStep2: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="left-[50%] absolute bottom-[50%] -translate-x-1/2">
      <StepNumber>1/4</StepNumber>

      <Header>Sochy</Header>
      <Description>
        Pod otazníky se skrývají sochy, které můžeš sbírat tím, že se k nim
        přiblížíš, klikneš na otazník a potom na „Ulov sochu“
      </Description>

      <Next onPress={onNext} text="Dále" />
      {/*<WizardArrow className="bottom-[-3px] left-[50%]  -translate-x-[-12px]" />*/}
    </WizardWrapper>
  </>
);

const TooltipStep3: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="left-[50%] absolute bottom-[130px] -translate-x-1/2">
      <StepNumber>2/4</StepNumber>

      <Header>Moje sochy</Header>
      <Description>Sem se sbírají sochy, které jsi ulovil/a.</Description>
      <Next onPress={onNext} text="Dále" />
    </WizardWrapper>
    <WizardArrow className="bottom-[128px] left-[50%]" />
  </>
);

const TooltipStep4: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="left-[10px] absolute bottom-[130px]">
      <StepNumber>3/4</StepNumber>
      <Header>Vyhledávání</Header>
      <Description>
        Vyhledávat můžeš pomocí adresy a zároveň si zobrazit svojí aktuální
        polohu.
      </Description>
      <Next onPress={onNext} text="Dále" />
    </WizardWrapper>
    <WizardArrow className="bottom-[128px] left-[30%]" />
  </>
);

const TooltipStep5: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="right-[10px] absolute bottom-[130px]">
      <StepNumber>4/4</StepNumber>
      <Header>Vyhledávání</Header>
      <Description>
        Objevuj Brno z nového úhlu pohledu. Sbírej sochy a soutěž s ostatními v
        počtu ulovených soch.
      </Description>
      <Next onPress={onNext} text="Pustit se do lovu" />
    </WizardWrapper>
    <WizardArrow className="bottom-[128px] right-[30%]" />
  </>
);

export const Step1 = () => (
  <View className="bg-white w-[280px] gap-3 p-5 rounded-xl mx-auto my-auto">
    <Text className="text-xl font-bold">Vydej se na lov soch!</Text>
    <Text className="text-base">
      Objevuj Brno z nového úhlu pohledu. Sbírej sochy a soutěž s ostatními v
      počtu ulovených soch.
    </Text>
    <Button variant="primary" className="mt-2" title="Jdu na to!" />
  </View>
);

const Wizard = () => {
  const { step, setStep } = useContext(WizardProviderContext);
  // We want to need to sign out out of the (tabs) layout and auth layout.
  // Because after signing out, session is deleted and hooks not working
  if (step === null) return null;
  return (
    <View className="absolute top-0 left-0   w-full h-full bg-[rgba(100,100,100,0.5)]">
      {step === 1 && <TooltipStep1 onNext={() => setStep(2)} />}
      {step === 2 && <TooltipStep2 onNext={() => setStep(3)} />}
      {step === 3 && <TooltipStep3 onNext={() => setStep(4)} />}
      {step === 4 && <TooltipStep4 onNext={() => setStep(5)} />}
      {step === 5 && <TooltipStep5 onNext={() => setStep(null)} />}
    </View>
  );
};

export default Wizard;
