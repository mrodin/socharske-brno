import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Map } from "../components/Map";
import { CollectionButton } from "../components/CollectionButton";
import { MenuButton } from "../components/MenuButton";
import { StatueDetail } from "../components/StatueDetail";
import { DrawerNavigation } from "../components/DrawerNavigation";
import { Statue } from "../types/statues";
import { User } from "./User";
import { MyStatues } from "./MyStatues";

type Routes =
  | "myStatues"
  | "bestHunters"
  | "trophies"
  | "trails"
  | "photos"
  | "layers"
  | "settings"
  | "map";

export const Main = () => {
  const [route, setRoute] = useState<Routes>("map");
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);

  if (route === "settings") {
    return <User onClose={() => setRoute("map")} />;
  }

  if (route === "myStatues") {
    return <MyStatues onClose={() => setRoute("map")} />;
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Map
          onSelectStatue={(statue) => {
            setSelectedStatue(statue);
          }}
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
