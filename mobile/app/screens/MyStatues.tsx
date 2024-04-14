import { FC } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { BackToMapButton } from "../components/BackToMapButton";
import { UserTag } from "../components/UserTag";
import { Title } from "../components/Title";
import { Label } from "../components/Label";
import { theme } from "../utils/theme";
import { MyStatueEntry } from "../components/MyStatueEntry";

type MyStatuesProps = {
  onClose: () => void;
};

export const MyStatues: FC<MyStatuesProps> = ({ onClose }) => {
  return (
    <SafeAreaView>
      <View style={{ gap: 30 }}>
        <View style={styles.row}>
          <BackToMapButton onClose={onClose} />
          <UserTag />
        </View>
        <View style={styles.row}>
          <Title>Moje sochy</Title>
          <Label
            stroke={1}
            strokeColor={theme.greyLight}
            backgroundColor={theme.greyLight}
          >
            3 ulovené sochy
          </Label>
        </View>
        <View style={styles.entries}>
          <MyStatueEntry />
        </View>
        <View style={styles.row}>
          <Title>Zbývá ulovit</Title>
          <Label>3 ulovené sochy</Label>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  entries: {
    paddingHorizontal: 24,
  },
  row: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
