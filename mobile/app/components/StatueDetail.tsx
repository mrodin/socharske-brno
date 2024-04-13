import React, { FC, useCallback, useRef } from "react";
import { Image, Text, StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Statue } from "../types/statues";

type StatueDetailProps = {
  statue: Statue | null;
};

export const StatueDetail: FC<StatueDetailProps> = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={["40%", "95%"]}
      backgroundStyle={{
        borderTopLeftRadius: HANDLE_BORDER_RADIUS,
        borderTopRightRadius: HANDLE_BORDER_RADIUS,
      }}
      handleComponent={() => (
        <Image
          source={require("../../assets/images/spravedlnost.png")}
          style={styles.handleImage}
        />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.layout}>
          <Text style={styles.title}>Spravedlnost</Text>
          <Text>
            Sochu před budovou Nejvyššího správního soudu na Moravském náměstí
            její autor Marius Kotrba vysvětluje slovy, že spravedlnost je
            záležitost těžká a zároveň křehká. Postava spravedlnosti nevládne,
            ale potýká se s ní, a proud vody ji zespodu nadzvedává, někdy
            zlehka, jindy silou...
          </Text>
          <View style={styles.attributesLayout}></View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const HANDLE_BORDER_RADIUS = 50;

const styles = StyleSheet.create({
  attributesLayout: {},
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    padding: 24,
  },
  handleImage: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: HANDLE_BORDER_RADIUS,
    borderTopRightRadius: HANDLE_BORDER_RADIUS,
  },
  layout: {
    flexDirection: "column",
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
