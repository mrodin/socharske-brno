import React, { FC, memo, useContext, useRef } from "react";
import { Text, View } from "react-native";
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
  ({ point, onPress }) => {
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
          <>
            {isPointCluster(point) ? (
              // render cluster
              <View className="w-12 h-12 rounded-full bg-gray-lighter justify-center items-center">
                <Text className="text-white font-bold">
                  {point.properties.point_count}
                </Text>
              </View>
            ) : (
              // render statue marker
              <View className="w-20 h-48 items-center justify-center">
                <UndiscoveredStatueIcon />
                {point.properties.distance ? (
                  <DistanceTooltip
                    distance={formatDistance(point.properties.distance)}
                  />
                ) : null}
              </View>
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

              // </>
            )}
          </>
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
      // for statues, compare just id and distance
      return (
        prevProps.point.properties.id === nextProps.point.properties.id &&
        prevProps.point.properties.distance ===
          nextProps.point.properties.distance
      );
    }
    // one is a cluster and one is a statue, they're different
    return false;
  }
);

const DistanceTooltip: FC<{ distance: string }> = ({ distance }) => {
  return (
    <View className="absolute left-0 bottom-[120px]">
      <View className="bg-gray-lighter rounded-3xl w-20 h-[32px] justify-center items-center">
        <Text className="text-md text-center text-white">{distance}</Text>
      </View>
      {/* Triangle pointing downward */}
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
      title={"marker.title"}
      description={"marker.description"}
    />
  );
};
