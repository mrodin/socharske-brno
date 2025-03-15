import React, { FunctionComponent, memo, useContext } from "react";
import { Image, Text, StyleSheet, View } from "react-native";
import { Marker as MapsMarker } from "react-native-maps";

import { useGetCollectedStatues } from "@/api/queries";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { MapPoint } from "@/types/common";
import { theme } from "@/utils/theme";
import { isPointCluster } from "react-native-clusterer";

type PointProps = {
  point: MapPoint;
  onPress: (point: MapPoint) => void;
};

export const Point: FunctionComponent<PointProps> = memo(
  ({ point, onPress }) => {
    const { selectedStatue, setSelectedStatue } = useContext(
      SelectedStatueContext
    );

    const { data: collectedStatueIds } = useGetCollectedStatues();

    return (
      <MapsMarker
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
          <Image
            style={[
              selectedStatue?.id === point.properties.id
                ? { borderWidth: 2, borderColor: theme.red }
                : {},
              collectedStatueIds.includes(point.properties.id)
                ? styles.foundStateuMarker
                : styles.notFoundStatueMarker,
            ]}
            source={
              collectedStatueIds.includes(point.properties.id)
                ? // ? {
                  //     uri: statue.imgthumbnail,
                  //   }
                  // TODO: martin.rodin: Replace with actual image
                  require("../../assets/found-state-marker.png")
                : require("../../assets/map/undiscovered-statue.png")
            }
          />
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

const styles = StyleSheet.create({
  foundStateuMarker: { width: 60, height: 60, borderRadius: 30 },
  notFoundStatueMarker: { width: 40, height: 40, borderRadius: 20 },
});
