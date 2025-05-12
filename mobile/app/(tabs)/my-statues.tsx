import { FC } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";

import { useGetAllStatues, useGetCollectedStatues } from "@/api/queries";
import { Label } from "@/components/Label";
import { MyStatueEntry } from "@/components/MyStatueEntry";
import { Title } from "@/components/Title";
import { UndiscoveredStatue } from "@/components/UndiscoveredStatue";
import { UserTag } from "@/components/UserTag";
import { theme } from "@/utils/theme";
import { RouteHeader } from "@/components/RouteHeader";

const MyStatues: FC = () => {
  const { data: statues } = useGetAllStatues();
  const { data: collectedStatues } = useGetCollectedStatues();
  console.log("statues", collectedStatues);

  const foundStatues = statues.filter((statue) =>
    collectedStatues.some(
      (collectedStatues) => collectedStatues.statue_id === statue.id
    )
  );

  const collectedStatuesList = collectedStatues.map((collectedStatue) => ({
    ...collectedStatue,
    statueInfo: statues.find(
      (statue) => statue.id === collectedStatue.statue_id
    ),
  }));

  const undicoveredStatues = statues
    .filter(
      (statue) =>
        !collectedStatues.some(
          (collectedStatue) => collectedStatue.statue_id === statue.id
        )
    )
    .slice(0, 20);

  return (
    <SafeAreaView className="bg-gray h-full">
      <ScrollView>
        <RouteHeader route="Moje sochy" />
        <View style={{ gap: 30 }}>
          <View className="flex flex-row justify-between items-center px-6">
            <UserTag />
          </View>
          <View className="flex flex-row gap-3 items-center px-6">
            <Title>Moje sochy</Title>
            <Label
              stroke={1}
              strokeColor={theme.greyLight}
              backgroundColor={theme.greyLight}
              fontColor={theme.white}
            >
              {foundStatues.length}
            </Label>
          </View>
          <View className="px-6 gap-4">
            {collectedStatuesList.map((statue) => (
              <MyStatueEntry
                key={statue.statueInfo?.id}
                name={statue.statueInfo?.name ?? ""}
                thumbnail={statue.statueInfo?.thumbnail ?? ""}
                createdAt={statue.created_at}
              />
            ))}
          </View>
          <View className="flex flex-row gap-3 items-center px-6">
            <Title>Zbývá ulovit</Title>
            <Label>{undicoveredStatues.length}</Label>
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
