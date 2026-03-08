import { LocationProvider } from "@/providers/LocationProvider";
import { SelectedStatueProvider } from "@/providers/SelectedStatueProvider";
import { UserAvatarProvider } from "@/providers/UserAvatar";
import { UserInfoProvider } from "@/providers/UserInfo";
import { UserSessionContext } from "@/providers/UserSession";
import { WizardProvider } from "@/providers/WizardProvider";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { Slot } from "expo-router";
import { useContext } from "react";

export default function Layout() {
  const { session } = useContext(UserSessionContext);

  if (!session) {
    return <LoadingScreen />;
  }

  return (
    <UserInfoProvider>
      <UserAvatarProvider>
        <LocationProvider>
          <SelectedStatueProvider>
            <WizardProvider>
              <Slot />
            </WizardProvider>
          </SelectedStatueProvider>
        </LocationProvider>
      </UserAvatarProvider>
    </UserInfoProvider>
  );
}
