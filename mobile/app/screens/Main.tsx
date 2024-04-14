import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Map } from "../components/Map";
import { CollectionButton } from "../components/CollectionButton";
import { MenuButton } from "../components/MenuButton";
import { StatueDetail } from "../components/StatueDetail";
import { Statue } from "../types/statues";
import { User } from "./User";
import { MyStatues } from "./MyStatues";

type Routes = "map" | "user" | "myStatues";

export const Main = () => {
  const [route, setRoute] = useState<Routes>("map");
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);

  if (route === "user") {
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
          <MenuButton onPress={() => setRoute("user")} />
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
