import React, { FC, memo, useRef } from "react";
import { Image, Text, View } from "react-native";
import { Marker as MapsMarker } from "react-native-maps";

import { MapPoint as MapPointType } from "@/types/common";
import { isPointCluster } from "react-native-clusterer";
import { UndiscoveredStatueIcon } from "@/icons/UndiscoveredStatueIcon";
import { formatDistance } from "@/utils/math";

type MapPointProps = {
  point: MapPointType;
  onPress: (point: MapPointType) => void;
};

export const MapPoint: FC<MapPointProps> = memo(
  ({ onPress, point }) => {
    const testRef = useRef(null);

    return (
      <>
        {/* <DefaultMarker point={point} onPress={onPress} /> */}
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
          // Sets offset of the marker. Since we use round markers,
          // we need to set the offset to the center of the marker.
          // anchor is for iOS and calloutOffset is for Android.
          anchor={{ x: 0.5, y: 0.5 }}
          calloutOffset={{ x: 0.5, y: 0.5 }}
        >
          <MarkerContent point={point} />
        </MapsMarker>
      </>
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
      // for statues, compare id, distance, and isCollected
      return (
        prevProps.point.properties.id === nextProps.point.properties.id &&
        prevProps.point.properties.distance ===
          nextProps.point.properties.distance &&
        prevProps.point.properties.isCollected ===
          nextProps.point.properties.isCollected
      );
    }
    // one is a cluster and one is a statue, they're different
    return false;
  }
);

type MarkerContentProps = {
  point: MapPointType;
};

const MarkerContent: FC<MarkerContentProps> = ({ point }) => {
  if (isPointCluster(point)) {
    // cluster marker
    return (
      <View className="w-12 h-12 rounded-full bg-gray-lighter justify-center items-center">
        <Text className="text-white font-bold">
          {point.properties.point_count}
        </Text>
      </View>
    );
  }

  if (point.properties.isCollected) {
    // collected statue image
    return (
      <Image
        className="rounded-full h-16 w-16 border-2 border-red"
        source={{
          uri: `https://storage.googleapis.com/lovci-soch-images/${point.properties.id}/thumb96/1.JPEG`,
        }}
      />
    );
  }

  // undiscovered statue marker
  return (
    <View className="w-20 h-48 items-center justify-center">
      <UndiscoveredStatueIcon />
      {point.properties.distance ? (
        <DistanceTooltip distance={formatDistance(point.properties.distance)} />
      ) : null}
    </View>
  );
};

const DistanceTooltip: FC<{ distance: string }> = ({ distance }) => {
  return (
    <View className="absolute left-0 bottom-[120px]">
      <View className="bg-gray-lighter rounded-3xl w-20 h-[32px] justify-center items-center">
        <Text className="text-md text-center text-white">{distance}</Text>
      </View>
      {/* triangle pointing downward */}
      <View className="w-0 h-0 bg-transparent border-solid border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-gray-lighter self-center -mt-px -z-10" />
    </View>
  );
};

// Do not delete this component. It is used for debugging purposes
// (to check if the custom marker is properly positioned).
const DefaultMarker: FC<MapPointProps> = ({ point, onPress }) => {
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
      title="marker.title"
      description="marker.description"
    />
  );
};
