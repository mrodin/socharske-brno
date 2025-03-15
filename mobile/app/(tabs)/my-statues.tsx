import { FC } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";

import { useGetAllStatues, useGetCollectedStatues } from "@/api/queries";
import { RouteHeader } from "@/components/RouteHeader";
import { Label } from "@/components/Label";
import { MyStatueEntry } from "@/components/MyStatueEntry";
import { Title } from "@/components/Title";
import { UndiscoveredStatue } from "@/components/UndiscoveredStatue";
import { UserTag } from "@/components/UserTag";
import { theme } from "@/utils/theme";

const MyStatues: FC = () => {
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
          <View className="flex flex-row justify-between items-center px-6">
            <BackToMapButton onClose={() => router.push("/")} />
            <UserTag />
          </View>
          <View className="flex flex-row justify-between items-center px-6">
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
          <View className="px-6 gap-4">
            {foundStatues.map((statue) => (
              <MyStatueEntry
                key={statue.id}
                name={statue.name}
                thumbnail={statue.imgthumbnail}
              />
            ))}
          </View>
          <View className="flex flex-row justify-between items-center px-6">
            <Title>Zbývá ulovit</Title>
            <Label>{`${undicoveredStatues.length} zbývá`}</Label>
          </View>
          <View className="px-6 gap-4">
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

export default MyStatues;
