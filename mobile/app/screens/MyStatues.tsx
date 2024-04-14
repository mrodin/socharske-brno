import { FC } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { BackToMapButton } from "../components/BackToMapButton";
import { UserTag } from "../components/UserTag";

type MyStatuesProps = {
  onClose: () => void;
};

export const MyStatues: FC<MyStatuesProps> = ({ onClose }) => {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <BackToMapButton onClose={onClose} />
        <UserTag />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
