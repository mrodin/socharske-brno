import { styled } from "nativewind";
import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Region } from "react-native-maps";
import { CollectionButton } from "../components/CollectionButton";
import { DrawerNavigation } from "../components/DrawerNavigation";
import { Map } from "../components/Map";
import { MenuButton } from "../components/MenuButton";
import { StatueDetail } from "../components/StatueDetail";
import { UserSessionContext } from "../providers/UserSession";
import { Statue } from "../types/statues";
import { LeaderBoard } from "./LeaderBoard";
import { MyStatues } from "./MyStatues";
import { User } from "./User";

const brnoRegion = {
  latitude: 49.1759324,
  longitude: 16.5630407,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type Routes =
  | "myStatues"
  | "leaderBoard"
  | "trophies"
  | "trails"
  | "photos"
  | "layers"
  | "settings"
  | "map";

const StyledView = styled(View);

export const Main = () => {
  const [initialRegion, setInitialRegion] = useState<Region>(brnoRegion);
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
    if (session) {
      setRoute("map");
    }
  }, [session === null, setRoute]);

  if (loading) {
    return (
      <StyledView tw="w-full h-full absolute">
        <Image
          style={{ width: "100%", height: "100%", position: "absolute" }}
          source={require("../../assets/intro.png")}
        />
      </StyledView>
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
          initialRegion={initialRegion}
          setInitialRegion={setInitialRegion}
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
            setInitialRegion={setInitialRegion}
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
