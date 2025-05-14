import { FC, useMemo } from "react";
import { SafeAreaView, View, Text, SectionList } from "react-native";

import { useGetAllStatues, useGetCollectedStatues } from "@/api/queries";
import { Label } from "@/components/Label";
import { Title } from "@/components/Title";
import { UserTag } from "@/components/UserTag";
import { RouteHeader } from "@/components/RouteHeader";
import { calculateDistance } from "@/utils/math";
import { StatueEntry } from "@/components/StatueEntry";
import { format } from "date-fns";
import { useLocation } from "@/hooks/useLocation";

const MyStatues: FC = () => {
  const { data: statues } = useGetAllStatues();
  const { data: collectedStatues } = useGetCollectedStatues();
  const location = useLocation();

  const collectedStatuesList = useMemo(
    () =>
      collectedStatues.map((collectedStatue) => ({
        ...collectedStatue,
        distance: 0,
        statueInfo: statues.find(
          (statue) => statue.id === collectedStatue.statue_id
        ),
      })),
    [statues, collectedStatues]
  );

  const undiscoveredStatues = useMemo(
    () =>
      statues
        .filter(
          (statue) =>
            !collectedStatues.some(
              (collectedStatue) => collectedStatue.statue_id === statue.id
            )
        )
        .map((statue) => ({
          statue_id: statue.id,
          statueInfo: statue,
          created_at: "",
          value: 0,
          distance: location?.coords.latitude
            ? calculateDistance(
                statue.lat,
                statue.lng,
                location?.coords.latitude,
                location?.coords.longitude
              )
            : 0,
        }))
        .sort((a, b) => a.distance - b.distance),
    [statues, collectedStatues, location]
  );

  // Create sections for SectionList
  const sections = useMemo(
    () => [
      {
        title: "Moje sochy",
        count: collectedStatuesList.length,
        data: collectedStatuesList,
      },
      {
        title: "Zbývá ulovit",
        count: undiscoveredStatues.length,
        data: undiscoveredStatues,
      },
    ],
    [collectedStatuesList, undiscoveredStatues]
  );

  return (
    <SafeAreaView className="bg-gray h-full">
      <RouteHeader route="Moje sochy" />
      <View className="flex flex-row justify-between items-center px-4 mb-4">
        <UserTag />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) =>
          "statue_id" in item ? item.statue_id.toString() : item.id.toString()
        }
        renderItem={({ item, section }) => {
          if (section.title === "Moje sochy") {
            return (
              <StatueEntry
                variant="primary"
                name={item.statueInfo?.name ?? ""}
                thumbnail={
                  item.statueInfo?.thumbnail
                    ? { uri: item.statueInfo?.thumbnail }
                    : require("../../assets/images/spravedlnost.png")
                }
                score={10}
                subtitle={format(new Date(item.created_at), "dd.MM.yyyy")}
              />
            );
          } else {
            return (
              <StatueEntry
                score={10}
                variant="secondary"
                name="???"
                subtitle={
                  <>
                    vzdálenost{" "}
                    <Text className="font-bold">
                      {(item as any).distance?.toFixed(2)}km
                    </Text>
                  </>
                }
              />
            );
          }
        }}
        renderSectionHeader={({ section }) => (
          <View className="flex flex-row gap-3 items-center py-3 bg-gray">
            <Title>{section.title}</Title>
            <Label>{section.count}</Label>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 18, gap: 4 }}
        stickySectionHeadersEnabled={true}
      />
    </SafeAreaView>
  );
};

export default MyStatues;
