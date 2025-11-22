import React, { FC, memo, useRef } from "react";
import { Image, Text, View } from "react-native";
import { Marker as MapsMarker } from "react-native-maps";

import { UndiscoveredStatueIcon } from "@/icons/UndiscoveredStatueIcon";
import { formatDistance } from "@/utils/math";

type StatueData = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance?: number;
  isCollected: boolean;
  [key: string]: any;
};

type MapPointProps = {
  statue: StatueData;
  onPress: (statue: StatueData) => void;
};

export const MapPoint: FC<MapPointProps> = memo(
  ({ onPress, statue }) => {
    const testRef = useRef(null);

    return (
      <MapsMarker
        ref={testRef}
        coordinate={{
          latitude: statue.lat,
          longitude: statue.lng,
        }}
        onPress={() => onPress(statue)}
        anchor={{ x: 0.5, y: 0.5 }}
        calloutOffset={{ x: 0.5, y: 0.5 }}
      >
        <MarkerContent statue={statue} />
      </MapsMarker>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.statue.id === nextProps.statue.id &&
      prevProps.statue.distance === nextProps.statue.distance &&
      prevProps.statue.isCollected === nextProps.statue.isCollected
    );
  }
);

type MarkerContentProps = {
  statue: StatueData;
};

const MarkerContent: FC<MarkerContentProps> = ({ statue }) => {
  if (statue.isCollected) {
    return (
      <Image
        className="rounded-full h-16 w-16 border-2 border-red"
        source={{
          uri: `https://storage.googleapis.com/lovci-soch-images/${statue.id}/thumb96/1.JPEG`,
        }}
      />
    );
  }

  return (
    <View className="w-20 h-48 items-center justify-center">
      <UndiscoveredStatueIcon />
      {statue.distance ? (
        <DistanceTooltip distance={formatDistance(statue.distance)} />
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
