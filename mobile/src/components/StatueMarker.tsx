import { UndiscoveredStatueIcon } from "@/icons/UndiscoveredStatueIcon";
import { View, Text } from "react-native";
import { Marker, MapMarker as MapMarkerType } from "react-native-maps";
import { tv } from "tailwind-variants";
import { Image as ExpoImage } from "expo-image";
import { FC, forwardRef } from "react";
import { StatuePoint } from "@/types/statues";
import { getThumbnailUrl } from "@/utils/images";
import { formatDistance } from "@/utils/math";

const statueMarker = tv({
  base: "",
  variants: {
    collected: {
      true: "w-16 h-16 rounded-full border-2 border-red overflow-hidden",
      false: "w-20 h-48 items-center justify-center",
    },
    highlighted: {
      true: "scale-110",
      false: "",
    },
  },
  compoundVariants: [
    {
      collected: false,
      highlighted: true,
      className: "bg-black bg-opacity-50",
    },
  ],
});

type StatueMarkerProps = {
  statue: StatuePoint;
  highlighted?: boolean;
  setLoadedImages: React.Dispatch<React.SetStateAction<Set<number>>>;
};

export const StatueMarker: FC<StatueMarkerProps> = ({
  statue,
  highlighted,
  setLoadedImages,
}) => {
  return (
    <View
      className={statueMarker({
        collected: statue.isCollected,
        highlighted,
      })}
    >
      {statue.isCollected ? (
        <ExpoImage
          style={{ width: "100%", height: "100%" }}
          source={{ uri: getThumbnailUrl(statue.id, 96) }}
          contentFit="cover"
          cachePolicy="memory-disk"
          onLoad={() => {
            setLoadedImages((prev) => new Set(prev).add(statue.id));
          }}
        />
      ) : (
        <>
          <UndiscoveredStatueIcon />
          {statue.distance ? (
            <View className="absolute left-0 bottom-[120px]">
              <View className="bg-gray-lighter rounded-3xl w-20 h-[32px] justify-center items-center">
                <Text className="text-md text-center text-white">
                  {formatDistance(statue.distance)}
                </Text>
              </View>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
};
