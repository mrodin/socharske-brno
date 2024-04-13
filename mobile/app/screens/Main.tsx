import React from "react";
import { StyleSheet, View } from "react-native";
import { Map } from "../components/Map";
import { CollectionButton } from "../components/CollectionButton";
import { MenuButton } from "../components/MenuButton";

export const Main = () => {
  const [showLeftDrawer, setShowLeftDrawer] = React.useState(false);

  return (
    <>
      <Map
        onSelectStatue={(item) => {
          console.log("Selected statue", item);
        }}
      />
      <View style={styles.leftDrawerButton}>
        <MenuButton onPress={() => setShowLeftDrawer(true)} />
      </View>
      <View style={styles.collectionButton}>
        <CollectionButton onPress={() => {}} />
      </View>
    </>
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
