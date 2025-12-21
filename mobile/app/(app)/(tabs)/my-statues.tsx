import { FC, useContext, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  VirtualizedList,
  Dimensions,
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
import { track } from "@amplitude/analytics-react-native";
import { cn } from "@/utils/cn";
import { getThumbnailUrl } from "@/utils/images";
import { Button } from "@/components/Button";

type StatueListItem = {
  isCollected: boolean;
  statue_id: number;
  statueInfo: Statue;
  created_at: string;
  value: number;
  distance: number;
};

const calculateLatOffset = (drawerHeightPercent: number) => {
  const screenHeight = Dimensions.get("window").height;
  const usableHeightPercent = 1 - drawerHeightPercent / 100;

  // We want the statue in the middle of the usable space
  const offsetPercent = 0.5 - usableHeightPercent / 2;
  const offsetPixels = screenHeight * offsetPercent;

  // Convert pixels to latitude degrees (approximate: 0.000015 degrees per pixel)
  const offsetLat = offsetPixels * 0.000015;
  return offsetLat;
};

const MyStatues: FC = () => {
  const { data: statueMap } = useGetAllStatues();
  const { data: collectedStatues = [] } = useGetCollectedStatues();
  const location = useLocation();
  const { setSelectedStatue } = useContext(SelectedStatueContext);
  const { animateToRegion } = useContext(LocationContext);
  const [tab, setTab] = useState<"collected" | "undiscovered">("collected");

  // Handler for navigating to a statue on the map
  const handleNavigateToStatue = (statue: Statue | null) => {
    track("Navigate to Statue", { statue_id: statue?.id, page: "My Statues" });
    setSelectedStatue(statue);
    if (statue) {
      router.navigate("/");

      const isCollected = collectedStatues.some(
        (cs) => cs.statue_id === statue.id
      );
      const drawerHeightPercent = isCollected ? 73 : 55;

      animateToRegion({
        latitude: statue.lat - calculateLatOffset(drawerHeightPercent),
        longitude: statue.lng,
      });
    }
  };

  const collectedStatuesList = useMemo<StatueListItem[]>(() => {
    if (Object.keys(statueMap).length === 0) {
      return [];
    }
    return collectedStatues
      .map((collectedStatue) => {
        const statueInfo = statueMap[collectedStatue.statue_id];
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
  }, [statueMap, collectedStatues]);

  const undiscoveredStatues = useMemo<StatueListItem[]>(() => {
    if (Object.keys(statueMap).length === 0) {
      return [];
    }
    const collectedIds = new Set(collectedStatues.map((cs) => cs.statue_id));

    return Object.values(statueMap)
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
  }, [statueMap, collectedStatues, location?.coords]);

  const showNoStatuesMessage =
    collectedStatuesList.length === 0 && tab === "collected";

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
        {showNoStatuesMessage ? (
          <NoCollectedStatuesInfo />
        ) : (
          <VirtualizedList
            data={
              tab === "undiscovered"
                ? undiscoveredStatues
                : collectedStatuesList
            }
            getItem={(data, index) => data[index]}
            renderItem={({ item, index }) => (
              <View className={cn("px-4", index === 0 && "mt-4")}>
                {tab === "undiscovered" ? (
                  <UndiscoveredStatueItem
                    statue={item}
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
        )}
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
    name={statue.statueInfo.name}
    onPress={() => onNavigate(statue.statueInfo)}
    score={statue.value}
    subtitle={format(new Date(statue.created_at), "dd.MM.yyyy")}
    thumbnailUrl={getThumbnailUrl(statue.statueInfo.id, 96)}
    variant="primary"
  />
);

// Component to render undiscovered statue entry
const UndiscoveredStatueItem: FC<{
  statue: StatueListItem;
  onNavigate: (statue: Statue) => void;
}> = ({ statue, onNavigate }) => (
  <StatueEntry
    score={statue.statueInfo.score}
    onPress={() => onNavigate(statue.statueInfo)}
    variant="secondary"
    name={statue.statueInfo.name}
    subtitle={
      <>
        vzdálenost{" "}
        <Text className="font-bold">{statue.distance.toFixed(2)}km</Text>
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

const NoCollectedStatuesInfo = () => (
  <View className="flex flex-1 justify-center items-center gap-4 px-6">
    <Text className="text-gray-pale text-center">
      Zatím nemáš ulovené žádné sochy.
      {"\n"}
      Honem to utíkej napravit!
    </Text>
    <Button
      variant="primary"
      title="Vydej se na lov"
      onPress={() => router.push("/")}
    />
  </View>
);

export default MyStatues;
