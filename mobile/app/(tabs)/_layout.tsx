import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { FC } from "react";

const TabLayout: FC = () => (
  <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
    <Tabs.Screen
      name="index"
      options={{
        title: "Home",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="home" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="search"
      options={{
        title: "Hledat",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="search" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="my-statues"
      options={{
        title: "Moje sochy",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="star" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="leaderboard"
      options={{
        title: "Leaderboard",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="trophy" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profil",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="user" color={color} />
        ),
      }}
    />
  </Tabs>
);

export default TabLayout;
