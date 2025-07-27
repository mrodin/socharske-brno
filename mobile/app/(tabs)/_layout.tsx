import { TabButton } from "@/components/navigation/TabButton";
import { SearchIcon } from "@/components/navigation/SearchIcon";
import { CrownIcon } from "@/components/navigation/CrownIcon";
import { JostStatueIcon } from "@/components/navigation/JostStatueIcon";
import { MapIcon } from "@/components/navigation/MapIcon";
import { UserIcon } from "@/components/navigation/UserIcon";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Text, View } from "react-native";
import { Navigation } from "@/components/navigation/Navigation";
import { LoadingContext } from "@/providers/LoadingProvider";
import { useContext } from "react";

export default function Layout() {
  const { loading } = useContext(LoadingContext);

  if (loading) {
    return null;
  }

  return (
    <Tabs>
      <TabSlot />

      <View className="relative w-full h-0">
        <View className="absolute top-4 left-0 w-full h-[102px] bg-gray shadow-[0px_-2px_5px_0px_rgba(0,0,0,0.15)]"></View>
      </View>
      <TabList asChild>
        <View className="h-[102px]">
          <TabTrigger name="home" href="/" asChild>
            <TabButton label="Do mapy" icon={MapIcon} />
          </TabTrigger>

          <TabTrigger name="search" href="/search" asChild>
            <TabButton label="Hledat" icon={SearchIcon} />
          </TabTrigger>

          <TabTrigger name="my-statues" href="/my-statues" asChild>
            <TabButton label="Moje sochy" icon={JostStatueIcon} accent />
          </TabTrigger>

          <TabTrigger name="leaderboard" href="/leaderboard" asChild>
            <TabButton label="Leaderboard" icon={CrownIcon} />
          </TabTrigger>

          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton label="Profil" icon={UserIcon} />
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}
