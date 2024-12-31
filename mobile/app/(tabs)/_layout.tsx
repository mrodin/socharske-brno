import { Navigation } from "@/components/navigation/Navigation";
import { LoadingContext } from "@/providers/LoadingProvider";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { useContext } from "react";

// For now Tablist is hidden, since it's imposible to style it properly
// You still need define route here to make it work
// Navigation is fully styled and using router.push to navigate
export default function Layout() {
  const { loading } = useContext(LoadingContext);
  return (
    <Tabs>
      <TabSlot />
      {!loading && <Navigation />}
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
