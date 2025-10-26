import { Navigation } from "@/components/navigation/Navigation";
import SignUp from "@/screens/SignUp";
import { UserInfoContext } from "@/providers/UserInfo";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { useContext } from "react";
import { View } from "react-native";

const NAVIGATION_HEIGHT = 96;

// For now Tablist is hidden, since it's impossible to style it properly
// You still need define route here to make it work
// Navigation is fully styled and using router.navigate to navigate
export default function Layout() {
  const { userInfo } = useContext(UserInfoContext);

  if (!userInfo) {
    return <LoadingScreen />;
  }

  // If user has no username, redirect to sign-up screen
  if (userInfo && !userInfo.username) {
    return <SignUp />;
  }

  return (
    <Tabs>
      <View className={`w-full h-full pb-[${NAVIGATION_HEIGHT}px]`}>
        <TabSlot />
      </View>
      <Navigation />
      <TabList style={{ display: "none" }}>
        <TabTrigger name="home" href="/" />
        <TabTrigger name="leaderboard" href="/leaderboard" />
        <TabTrigger name="my-statues" href="/my-statues" />
        <TabTrigger name="profile" href="/profile" />
        <TabTrigger name="search" href="/search" />
      </TabList>
    </Tabs>
  );
}
