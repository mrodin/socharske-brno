import React, { FC, memo, useContext, useEffect, useRef } from "react";
import { Image, Text, StyleSheet, View } from "react-native";
import { Callout, Marker as MapsMarker } from "react-native-maps";

import { useGetCollectedStatues } from "@/api/queries";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { MapPoint as MapPointType } from "@/types/common";
import { theme } from "@/utils/theme";
import { isPointCluster } from "react-native-clusterer";
import { UndiscoveredStatueIcon } from "@/icons/UndiscoveredStatueIcon";

type MapPointProps = {
  point: MapPointType;
  onPress: (point: MapPointType) => void;
};

export const MapPoint: FC<MapPointProps> = memo(
  ({ point, onPress }) => {
    const testRef = useRef(null);

    const { selectedStatue, setSelectedStatue } = useContext(
      SelectedStatueContext
    );

    const { data: collectedStatueIds } = useGetCollectedStatues();

    return (
      <MapsMarker
        ref={testRef}
        key={
          isPointCluster(point)
            ? `cluster-${point.properties?.cluster_id}`
            : `point-${point.properties?.id}`
        }
        coordinate={{
          latitude: point.geometry.coordinates[1],
          longitude: point.geometry.coordinates[0],
        }}
        // I think that this needs to be true for clustering to work
        // properly. Otherwise, some points are not rendered.
        tracksViewChanges
        onPress={() => onPress(point)}
      >
        {isPointCluster(point) ? (
          // render cluster
          <View className="w-12 h-12 rounded-full bg-gray-lighter justify-center items-center">
            <Text className="text-white font-bold">
              {point.properties.point_count}
            </Text>
          </View>
        ) : (
          // render statue marker
          <>
            <UndiscoveredStatueIcon />
            <DistanceTooltip distance={10} />
          </>
          // <>
          //   <Image
          //     style={[
          //       selectedStatue?.id === point.properties.id
          //         ? { borderWidth: 2, borderColor: theme.red }
          //         : {},
          //       collectedStatueIds.includes(point.properties.id)
          //         ? styles.foundStateuMarker
          //         : styles.notFoundStatueMarker,
          //     ]}
          //     source={
          //       collectedStatueIds.includes(point.properties.id)
          //         ? // ? {
          //           //     uri: statue.imgthumbnail,
          //           //   }
          //           // TODO: martin.rodin: Replace with actual image
          //           require("../../assets/found-state-marker.png")
          //         : require("../../assets/map/undiscovered-statue.png")
          //     }
          //   />

          //   {/* <DistanceTooltip distance={10} /> */}
          // </>
        )}
      </MapsMarker>
    );
  },
  (prevProps, nextProps) => {
    if (isPointCluster(prevProps.point) && isPointCluster(nextProps.point)) {
      // for clusters, compare cluster-specific properties
      return (
        prevProps.point.properties.cluster_id ===
          nextProps.point.properties.cluster_id &&
        prevProps.point.properties.point_count ===
          nextProps.point.properties.point_count &&
        prevProps.point.properties.getExpansionRegion ===
          nextProps.point.properties.getExpansionRegion
      );
    } else if (
      !isPointCluster(prevProps.point) &&
      !isPointCluster(nextProps.point)
    ) {
      // for statues, compare just id
      return prevProps.point.properties.id === nextProps.point.properties.id;
    }
    // one is a cluster and one is a statue, they're different
    return false;
  }
);

const DistanceTooltip: FC<{ distance: number }> = ({ distance }) => {
  return (
    <View className="absolute left0">
      <View className="bg-gray-lighter rounded-3xl w-20 h-6 justify-center items-center">
        <Text className="text-xs text-center">{distance.toString()}</Text>
      </View>
      {/* Triangle pointing downward */}
      <View
        style={{
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderStyle: "solid",
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderTopWidth: 12,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: theme.greyLight,
          alignSelf: "center",
          marginTop: -1,
          zIndex: -1,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  foundStateuMarker: { width: 60, height: 60, borderRadius: 30 },
  notFoundStatueMarker: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
