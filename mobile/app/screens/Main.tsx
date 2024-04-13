import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Map } from "../components/Map";
import { CollectionButton } from "../components/CollectionButton";
import { MenuButton } from "../components/MenuButton";
import { StatueDetail } from "../components/StatueDetail";
import { Statue } from "../types/statues";
import { User } from "./User";

export const Main = () => {
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map
        onSelectStatue={(statue) => {
          setSelectedStatue(statue);
        }}
      />
      <View style={styles.leftDrawerButton}>
        <MenuButton onPress={() => setShowLeftDrawer(true)} />
      </View>
      <View style={styles.collectionButton}>
        <CollectionButton onPress={() => {}} />
      </View>

      {showLeftDrawer && <User onClose={() => setShowLeftDrawer(false)} />}

      {selectedStatue && (
        <StatueDetail
          statue={selectedStatue}
          onClose={() => setSelectedStatue(null)}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  collectionButton: {
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
