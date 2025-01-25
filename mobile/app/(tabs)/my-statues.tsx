import { FC } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";

import { useGetAllStatues, useGetCollectedStatues } from "@/api/queries";
import { BackToMapButton } from "@/components/BackToMapButton";
import { Label } from "@/components/Label";
import { MyStatueEntry } from "@/components/MyStatueEntry";
import { Title } from "@/components/Title";
import { UndiscoveredStatue } from "@/components/UndiscoveredStatue";
import { UserTag } from "@/components/UserTag";
import { theme } from "@/utils/theme";

type MyStatuesProps = {
  onClose: () => void;
};

const MyStatues: FC<MyStatuesProps> = ({ onClose }) => {
  const { data: statues } = useGetAllStatues();
  const { data: collectedStatueIds } = useGetCollectedStatues();

  const foundStatues = statues.filter((statue) =>
    collectedStatueIds.includes(statue.id)
  );

  const undicoveredStatues = statues
    .filter((statue) => !collectedStatueIds.includes(statue.id))
    .slice(0, 20);

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

export default MyStatues;
