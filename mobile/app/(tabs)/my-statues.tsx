import { FC, useContext, useMemo } from "react";
import { SafeAreaView, View, Text, SectionList } from "react-native";
import { router } from "expo-router";

import { useGetAllStatues, useGetCollectedStatues } from "@/api/queries";
import { Label } from "@/components/Label";
import { Title } from "@/components/Title";
import { UserTag } from "@/components/UserTag";
import { RouteHeader } from "@/components/RouteHeader";
import { calculateDistance } from "@/utils/math";
import { StatueEntry } from "@/components/StatueEntry";
import { useLocation } from "@/hooks/useLocation";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { LocationContext } from "@/providers/LocationProvider";
import { Statue } from "@/types/statues";
import { DEFAULT_ZOOM } from "@/utils/constants";

type StatueListItem = {
  isCollected: boolean;
  statue_id: number;
  statueInfo: Statue;
  created_at: string;
  value: number;
  distance: number;
};

type SectionData = {
  title: string;
  count: number;
  data: StatueListItem[];
};

const MyStatues: FC = () => {
  const { data: statues = [] } = useGetAllStatues();
  const { data: collectedStatues = [] } = useGetCollectedStatues();
  const location = useLocation();
  const { setSelectedStatue } = useContext(SelectedStatueContext);
  const { setSearchRegion } = useContext(LocationContext);

  const findStatueById = (id: number) => {
    const statue = statues.find((statue) => statue.id === id);
    if (!statue) {
      throw new Error(`Statue with id ${id} not found`);
    }
    return statue;
  };

  // Handler for navigating to a statue on the map
  const handleNavigateToStatue = (statue: Statue | null) => {
    router.navigate("/");
    setSelectedStatue(statue);
    if (statue) {
      setSearchRegion({
        latitude: statue.lat,
        longitude: statue.lng,
        latitudeDelta: DEFAULT_ZOOM,
        longitudeDelta: DEFAULT_ZOOM,
      });
    }
  };

  const collectedStatuesList = useMemo<StatueListItem[]>(() => {
    if (statues.length === 0) {
      return [];
    }
    return collectedStatues.map((collectedStatue) => ({
      ...collectedStatue,
      isCollected: true,
      distance: 0,
      statueInfo: findStatueById(collectedStatue.statue_id),
    }));
  }, [statues, collectedStatues]);

  const undiscoveredStatues = useMemo<StatueListItem[]>(() => {
    if (statues.length === 0) {
      return [];
    }
    const collectedIds = new Set(collectedStatues.map((cs) => cs.statue_id));

    return statues
      .filter((statue) => !collectedIds.has(statue.id))
      .map((statue) => ({
        isCollected: false,
        statue_id: statue.id,
        statueInfo: statue,
        created_at: "",
        value: 0,
        distance: location?.coords.latitude
          ? calculateDistance(
              statue.lat,
              statue.lng,
              location.coords.latitude,
              location.coords.longitude
            )
          : 0,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [statues, collectedStatues, location?.coords]);

  // Create sections for SectionList
  const sections: SectionData[] = useMemo(
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
        keyExtractor={(item) => item.statueInfo.id.toString()}
        renderItem={({ item }) =>
          item.isCollected ? (
            <CollectedStatueItem
              item={item}
              onNavigate={handleNavigateToStatue}
            />
          ) : (
            <UndiscoveredStatueItem
              item={item}
              onNavigate={handleNavigateToStatue}
            />
          )
        }
        renderSectionHeader={({ section }) => (
          <SectionHeader section={section} />
        )}
        contentContainerStyle={{ paddingHorizontal: 18, gap: 4 }}
        stickySectionHeadersEnabled={true}
      />
    </SafeAreaView>
  );
};

// Component to render collected statue entry
const CollectedStatueItem: FC<{
  item: StatueListItem;
  onNavigate: (statue: Statue) => void;
}> = ({ item, onNavigate }) => (
  <StatueEntry
    onPress={() => onNavigate(item.statueInfo)}
    variant="primary"
    name={item.statueInfo.name}
    thumbnail={
      item.statueInfo.image_url ? { uri: item.statueInfo.image_url } : undefined
    }
    score={item.value}
    subtitle="12.7.2025"
    // subtitle={format(new Date(item.created_at), "dd.MM.yyyy")}
  />
);

// Component to render undiscovered statue entry
const UndiscoveredStatueItem: FC<{
  item: StatueListItem;
  onNavigate: (statue: Statue) => void;
}> = ({ item, onNavigate }) => (
  <StatueEntry
    score={item.statueInfo.score}
    onPress={() => onNavigate(item.statueInfo)}
    variant="secondary"
    name="???"
    subtitle={
      <>
        vzdálenost{" "}
        <Text className="font-bold">{item.distance.toFixed(2)}km</Text>
      </>
    }
  />
);

// Section header component
const SectionHeader: FC<{ section: SectionData }> = ({ section }) => (
  <View className="flex flex-row gap-3 items-center py-3 bg-gray">
    <Title>{section.title}</Title>
    <Label>{section.count}</Label>
  </View>
);

export default MyStatues;
