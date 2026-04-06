import { FC, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Button } from "@/components/Button";
import { ArrowRight } from "@/icons/ArrowRight";
import { WizardProviderContext } from "@/providers/WizardProvider";
import { UserInfoContext } from "@/providers/UserInfo";
import { Close } from "@/icons/Close";
import { cn } from "@/utils/cn";
import { UndiscoveredStatueIcon } from "@/icons/UndiscoveredStatueIcon";
import * as Notifications from "expo-notifications";

type TooltipProps = {
  onNext: () => void;
};

const WizardArrow: FC<{ className: string }> = ({ className }) => (
  <View className={cn("absolute w-[0px] h-[0px]", className)}>
    <View className="bg-white w-[20px] h-[20px] mt-[4px] ml-[4px] rotate-45 -translate-x-[14px] -translate-y-[14px]"></View>
  </View>
);

const CloseButton: FC<{ onClose: () => void }> = ({ onClose }) => (
  <Pressable
    className="absolute top-4 right-4 z-10"
    onPress={() => {
      onClose();
    }}
  >
    <Close width={10} height={10} color="#DF4237" />
  </Pressable>
);

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
  const { close } = useContext(WizardProviderContext);

  return (
    <View
      className={cn("absolute bg-white w-[280px] rounded-xl pt-8", className)}
    >
      <CloseButton onClose={close} />
      {children}
    </View>
  );
};

const WizardContent = ({ children }: { children: React.ReactNode }) => (
  <View className="p-5 flex flex-col gap-3">{children}</View>
);

const Header: FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <Text className={cn("text-xl font-bold", className)}>{children}</Text>;

const Description: FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <Text className={cn("text-base", className)}>{children}</Text>;

const StepNumber = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-lg -mt-2 font-light">{children}</Text>
);

export const TooltipStep1: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="my-auto mx-auto relative z-40">
      <WizardContent>
        <Header className="text-center">Vydej se na lov soch!</Header>
        <Description className="text-center">
          Objevuj Brno z nového úhlu pohledu. Sbírej sochy a soutěž s ostatními
          v počtu ulovených soch.
        </Description>
        <Button
          variant="primary"
          className="mt-2"
          title="Jdu na to!"
          onPress={onNext}
        />
      </WizardContent>
    </WizardWrapper>
  </>
);

const TooltipStep2: FC<TooltipProps> = ({ onNext }) => (
  <>
    <View className="flex items-center justify-center h-full ">
      <UndiscoveredStatueIcon />
    </View>
    <WizardWrapper className="left-[50%] absolute bottom-[50%] -translate-x-1/2 translate-y-[-50px]">
      <WizardContent>
        <StepNumber>1/4</StepNumber>
        <Header>Sochy</Header>
        <Description>
          Pod otazníky se skrývají sochy. Ulovíš je tím, že se k nim přiblížíš
          na 20 metrů a vyřešíš skládačku.
        </Description>

        <Next onPress={onNext} text="Dále" />
      </WizardContent>
      <WizardArrow className="bottom-[0px] left-[50%] " />
    </WizardWrapper>
  </>
);

const TooltipStep3: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="left-[10px] absolute bottom-[30px]">
      <WizardContent>
        <StepNumber>2/4</StepNumber>
        <Header>Moje sochy</Header>
        <Description>
          Tady najdeš sochy, které jsi ulovil/a, nebo které zbývá ulovit.
        </Description>
        <Next onPress={onNext} text="Dále" />
      </WizardContent>
    </WizardWrapper>
    <WizardArrow className="bottom-[30px] left-[30%]" />
  </>
);

const TooltipStep4: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="left-[10px] absolute bottom-[30px]">
      <WizardContent>
        <StepNumber>3/4</StepNumber>
        <Header>Vyhledávání</Header>
        <Description>Vyhledávat můžeš podle adresy.</Description>
        <Next onPress={onNext} text="Dále" />
      </WizardContent>
    </WizardWrapper>
    <WizardArrow className="bottom-[30px] left-[13%]" />
  </>
);

const TooltipStep5: FC<TooltipProps> = ({ onNext }) => (
  <>
    <WizardWrapper className="right-[10px] absolute bottom-[30px]">
      <WizardContent>
        <StepNumber>4/4</StepNumber>
        <Header>Profil a nastavení</Header>
        <Description>
          Tady si můžeš nastavit svůj profil anebo funkce aplikace.
        </Description>
        <Next onPress={onNext} text="Dále" />
      </WizardContent>
    </WizardWrapper>
    <WizardArrow className="bottom-[30px] right-[13%]" />
  </>
);

const TooltipStep6: FC<TooltipProps> = ({ onNext }) => {
  const { requestPushPermission } = useContext(UserInfoContext);

  const handleAllow = async () => {
    await requestPushPermission();
    onNext();
  };

  const handleDeny = async () => {
    // Trigger the iOS dialog so the app appears in iOS Settings.
    // We ignore the result — user decides in the iOS dialog.
    await Notifications.requestPermissionsAsync();
    onNext();
  };

  return (
    <WizardWrapper className="my-auto mx-auto relative z-40 w-[340px]">
      <WizardContent>
        <Header className="text-center">Nezmeškej dění ve hře!</Header>
        <Description className="text-center">
          Pošleme ti upozornění, když budeš déle než týden bez nové sochy.
          Maximálně jednou týdně, žádný spam.
        </Description>
        <View className="flex flex-row gap-3 mt-4">
          <Button
            variant="secondary"
            className="flex-1"
            title="Zakázat"
            onPress={handleDeny}
          />
          <Button
            variant="primary"
            className="flex-1"
            title="Jasan!"
            onPress={handleAllow}
          />
        </View>
      </WizardContent>
    </WizardWrapper>
  );
};

const Wizard = () => {
  const { step, setStep, close } = useContext(WizardProviderContext);
  if (step === null) return null;
  return (
    <View className="absolute top-0 left-0 w-full h-full">
      {step === 1 && <TooltipStep1 onNext={() => setStep(2)} />}
      {step === 2 && <TooltipStep2 onNext={() => setStep(3)} />}
      {step === 3 && <TooltipStep3 onNext={() => setStep(4)} />}
      {step === 4 && <TooltipStep4 onNext={() => setStep(5)} />}
      {step === 5 && <TooltipStep5 onNext={() => setStep(6)} />}
      {step === 6 && <TooltipStep6 onNext={close} />}
    </View>
  );
};

export default Wizard;
