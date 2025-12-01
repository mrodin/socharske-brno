import {
  Navigation,
  NavigationRoute,
} from "@/components/navigation/Navigation";
import SignUp from "@/screens/SignUp";
import { UserInfoContext } from "@/providers/UserInfo";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { Wizard } from "@/screens/Wizard";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { useContext } from "react";
import { View } from "react-native";
import { router, usePathname } from "expo-router";
import { WizardProviderContext } from "@/providers/WizardProvider";

const NAVIGATION_HEIGHT = 96;

const getRootPath = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 0 ? `/${segments[0]}` : "/";
};

export default function Layout() {
  const { userInfo } = useContext(UserInfoContext);
  const wizard = useContext(WizardProviderContext);

  const pathName = usePathname();

  const handlePressMenu = (route: NavigationRoute) => {
    const isRoot = route === "/";
    const isActive = isRoot ? pathName === route : pathName.startsWith(route);
    const isSubroute =
      !isRoot && pathName !== route && pathName.startsWith(route);

    if (isActive && isSubroute) {
      // Reset to root of the tab
      router.dismissAll();
    } else if (!isActive) {
      // Navigate to selected tab
      router.navigate(route as any);
    }
  };

  if (!userInfo) {
    return <LoadingScreen />;
  }

  // If user has no username, show sign-up screen
  if (userInfo && !userInfo.username) {
    return <SignUp />;
  }

  // Show wizard if it's active
  if (wizard.step !== null) {
    return <Wizard />;
  }

  return (
    <Tabs>
      <View
        className={`w-full h-full pb-[${NAVIGATION_HEIGHT}px] bg-[#393939]`}
      >
        <TabSlot />
      </View>
      <Navigation
        onPress={handlePressMenu}
        selectedRoute={getRootPath(pathName) as NavigationRoute}
      />
      {/*
        For now Tablist is hidden, since it's impossible to style it properly
        You still need define route here to make it work
        Navigation is fully styled and using router.navigate to navigate
      */}
      <TabList>
        <TabTrigger name="home" href="/" />
        <TabTrigger name="leaderboard" href="/leaderboard" />
        <TabTrigger name="my-statues" href="/my-statues" />
        <TabTrigger name="profile" href="/profile" />
        <TabTrigger name="search" href="/search" />
      </TabList>
    </Tabs>
  );
}
