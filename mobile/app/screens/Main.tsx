import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Map } from "../components/Map";
import { CollectionButton } from "../components/CollectionButton";
import { MenuButton } from "../components/MenuButton";
import { StatueDetail } from "../components/StatueDetail";
import { DrawerNavigation } from "../components/DrawerNavigation";
import { Statue } from "../types/statues";
import { User } from "./User";
import { MyStatues } from "./MyStatues";
import { LeaderBoard } from "./LeaderBoard";
import { UserSessionContext } from "../providers/UserSession";

type Routes =
  | "myStatues"
  | "leaderBoard"
  | "trophies"
  | "trails"
  | "photos"
  | "layers"
  | "settings"
  | "map";

export const Main = () => {
  const [route, setRoute] = useState<Routes>("settings");
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session } = useContext(UserSessionContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    console.log("Session", !!session, Date.now());
  }, [session]);

  useEffect(() => {
    if (session) {
      setRoute("map");
    }
  }, [session === null, setRoute]);

  if (loading) {
    return (
      <View style={{ width: "100%", height: "100%", position: "absolute" }}>
        <Image
          style={{ width: "100%", height: "100%", position: "absolute" }}
          source={require("../../assets/intro.png")}
        />
      </View>
    );
  }

  if (route === "settings") {
    return <User onClose={() => setRoute("map")} />;
  }

  if (route === "myStatues") {
    return <MyStatues onClose={() => setRoute("map")} />;
  }

  if (route === "leaderBoard") {
    return <LeaderBoard onClose={() => setRoute("map")} />;
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Map
          onSelectStatue={(statue) => {
            setSelectedStatue(statue);
          }}
          selectedStatue={selectedStatue}
        />
        <View style={styles.leftDrawerButton}>
          <MenuButton onPress={() => setShowLeftDrawer(true)} />
        </View>
        <View style={styles.myStatuesButton}>
          <CollectionButton onPress={() => setRoute("myStatues")} />
        </View>

        {selectedStatue && (
          <StatueDetail
            statue={selectedStatue}
            onClose={() => setSelectedStatue(null)}
          />
        )}
        {showLeftDrawer && (
          <DrawerNavigation
            onClose={() => setShowLeftDrawer(false)}
            onSelect={(route) => {
              setRoute(route as Routes);
              setShowLeftDrawer(false);
            }}
          />
        )}
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  myStatuesButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  leftDrawerButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
});
