import { FC } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import { BackToMapButton } from "../components/BackToMapButton";
import { UserTag } from "../components/UserTag";
import { Title } from "../components/Title";
import { Label } from "../components/Label";
import { MyStatueEntry } from "../components/MyStatueEntry";
import { UndiscoveredStatue } from "../components/UndiscoveredStatue";
import statues from "../data/statues.json";
import { useGetCollectedStatues } from "../api/queries";
import { theme } from "../utils/theme";

type MyStatuesProps = {
  onClose: () => void;
};

export const MyStatues: FC<MyStatuesProps> = ({ onClose }) => {
  const { data: statueIds, isLoading } = useGetCollectedStatues();

  const foundStatues = statues.filter((statue) =>
    statueIds?.includes(statue.id)
  );

  const undicoveredStatues = statues.filter(
    (statue) => !statueIds?.includes(statue.id)
  );

  return (
    <SafeAreaView>
      <ScrollView>
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
              fontColor={theme.white}
            >
              {`${foundStatues.length} ulovené sochy`}
            </Label>
          </View>
          <View style={styles.entries}>
            {foundStatues.map((statue) => (
              <MyStatueEntry
                key={statue.id}
                name={statue.name}
                thumbnail={statue.imgthumbnail}
              />
            ))}
          </View>
          <View style={styles.row}>
            <Title>Zbývá ulovit</Title>
            <Label>{`${undicoveredStatues.length} zbývá`}</Label>
          </View>
          <View style={styles.entries}>
            {undicoveredStatues.map((statue) => (
              <UndiscoveredStatue
                key={statue.id}
                lat={statue.lat}
                lng={statue.lng}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  entries: {
    paddingHorizontal: 24,
    gap: 16,
  },
  row: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
