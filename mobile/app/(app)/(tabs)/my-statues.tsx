import { FC, useContext, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  VirtualizedList,
} from "react-native";
import { router } from "expo-router";
import { format } from "date-fns";

import { useGetAllStatues, useGetCollectedStatues } from "@/api/queries";
import { UserTag } from "@/components/UserTag";
import { RouteHeader } from "@/components/RouteHeader";
import { calculateDistance } from "@/utils/math";
import { StatueEntry } from "@/components/StatueEntry";
import { useLocation } from "@/hooks/useLocation";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { LocationContext } from "@/providers/LocationProvider";
import { Statue } from "@/types/statues";
import { DEFAULT_ZOOM } from "@/utils/constants";
import { track } from "@amplitude/analytics-react-native";
import { cn } from "@/utils/cn";

type StatueListItem = {
  isCollected: boolean;
  statue_id: number;
  statueInfo: Statue;
  created_at: string;
  value: number;
  distance: number;
};

const MyStatues: FC = () => {
  const { data: statues = [] } = useGetAllStatues();
  const { data: collectedStatues = [] } = useGetCollectedStatues();
  const location = useLocation();
  const { setSelectedStatue } = useContext(SelectedStatueContext);
  const { setSearchRegion } = useContext(LocationContext);
  const [tab, setTab] = useState<"collected" | "undiscovered">("collected");

  // Handler for navigating to a statue on the map
  const handleNavigateToStatue = (statue: Statue | null) => {
    track("Navigate to Statue", { statue_id: statue?.id, page: "My Statues" });
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
    if (Object.keys(statues).length === 0) {
      return [];
    }
    return collectedStatues
      .map((collectedStatue) => {
        const statueInfo = statues[collectedStatue.statue_id];
        if (!statueInfo) {
          track("Statue Not Found", { statue_id: collectedStatue.statue_id });
          return null;
        }
        return {
          ...collectedStatue,
          isCollected: true,
          distance: 0,
          statueInfo,
        };
      })
      .filter((statue): statue is StatueListItem => statue !== null);
  }, [statues, collectedStatues]);

  const undiscoveredStatues = useMemo<StatueListItem[]>(() => {
    if (Object.keys(statues).length === 0) {
      return [];
    }
    const collectedIds = new Set(collectedStatues.map((cs) => cs.statue_id));

    return Object.values(statues)
      .filter((statue) => statue.visible && !collectedIds.has(statue.id))
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

  return (
    <SafeAreaView className="bg-gray h-full">
      <RouteHeader route="Moje sochy" />
      <View className="flex flex-row justify-between items-center px-4 mb-4">
        <UserTag />
      </View>
      <View className="flex flex-row pt-4 pb-0">
        <TabButton
          label={`Zbývá ulovit (${undiscoveredStatues.length})`}
          isActive={tab === "undiscovered"}
          onPress={() => setTab("undiscovered")}
        />

        <TabButton
          label={`Moje sochy (${collectedStatuesList.length})`}
          isActive={tab === "collected"}
          onPress={() => setTab("collected")}
        />
      </View>
      <View className="flex-1">
        <VirtualizedList
          data={
            tab === "undiscovered" ? undiscoveredStatues : collectedStatuesList
          }
          getItem={(data, index) => data[index]}
          renderItem={({ item, index }) => (
            <View className={cn("px-4", index === 0 && "mt-4")}>
              {tab === "undiscovered" ? (
                <UndiscoveredStatueItem
                  item={item}
                  onNavigate={handleNavigateToStatue}
                />
              ) : (
                <CollectedStatueItem
                  statue={item}
                  onNavigate={handleNavigateToStatue}
                />
              )}
            </View>
          )}
          getItemCount={(data) => data?.length || 0}
          keyExtractor={(item) => `${item.statue_id}`}
        />
      </View>
    </SafeAreaView>
  );
};

// Component to render collected statue entry
const CollectedStatueItem: FC<{
  statue: StatueListItem;
  onNavigate: (statue: Statue) => void;
}> = ({ statue, onNavigate }) => (
  <StatueEntry
    onPress={() => onNavigate(statue.statueInfo)}
    variant="primary"
    name={statue.statueInfo.name}
    thumbnail={
      statue.statueInfo.image_url
        ? { uri: statue.statueInfo.image_url }
        : undefined
    }
    score={statue.value}
    subtitle={format(new Date(statue.created_at), "dd.MM.yyyy")}
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

const TabButton: FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
}> = ({ label, isActive, onPress }) => (
  <View
    className={cn(
      "flex-1 items-center relative",
      isActive
        ? "border-b-4 border-red-light"
        : "border-b-[1px] border-gray-light"
    )}
  >
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        className={cn(
          "pb-2",
          isActive ? "text-red-light font-bold" : "text-gray-pale"
        )}
      >
        {label}
      </Text>
    </Pressable>
  </View>
);

export default MyStatues;
