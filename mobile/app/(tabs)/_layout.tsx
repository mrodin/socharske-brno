import { TabButton } from "@/components/navigation/TabButton";
import { SearchIcon } from "@/components/navigation/SearchIcon";
import { CrownIcon } from "@/components/navigation/CrownIcon";
import { JostStatueIcon } from "@/components/navigation/JostStatueIcon";
import { MapIcon } from "@/components/navigation/MapIcon";
import { UserIcon } from "@/components/navigation/UserIcon";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Text, View } from "react-native";
import { Navigation } from "@/components/navigation/Navigation";

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />

      {/* Custom styled tab bar */}
      <View className="absolute bottom-0 left-0 w-full h-[110px]">
        <View className="relative w-full h-0">
          <View className="absolute top-4 left-0 w-full h-[102px] bg-gray shadow-[0px_-2px_5px_0px_rgba(0,0,0,0.15)]"></View>
        </View>
        <View className="flex flex-row justify-between items-end px-7">
          <TabTrigger name="home" asChild>
            <TabButton label="Do mapy" icon={MapIcon} />
          </TabTrigger>

          <TabTrigger name="search" asChild>
            <TabButton label="Hledat" icon={SearchIcon} />
          </TabTrigger>

          <TabTrigger name="my-statues" asChild>
            <TabButton label="Moje sochy" icon={JostStatueIcon} accent />
          </TabTrigger>

          <TabTrigger name="leaderboard" asChild>
            <TabButton label="Leaderboard" icon={CrownIcon} />
          </TabTrigger>

          <TabTrigger name="profile" asChild>
            <TabButton label="Profil" icon={UserIcon} />
          </TabTrigger>
        </View>
      </View>

      {/* <Navigation /> */}

      {/* Hidden TabList for route configuration */}
      <TabList style={{ display: "none" }}>
        <TabTrigger name="home" href="/">
          <Text>Home</Text>
        </TabTrigger>
        <TabTrigger name="leaderboard" href="/leaderboard">
          <Text>Leaderboard</Text>
        </TabTrigger>
        <TabTrigger name="my-statues" href="/my-statues">
          <Text>My statues</Text>
        </TabTrigger>
        <TabTrigger name="profile" href="/profile">
          <Text>Profile</Text>
        </TabTrigger>
        <TabTrigger name="search" href="/search">
          <Text>Search</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
