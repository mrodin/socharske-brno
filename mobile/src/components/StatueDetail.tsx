import { useRouter } from "expo-router";
import React, {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  LayoutChangeEvent,
  Linking,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { tv } from "tailwind-variants";

import { Statue } from "../types/statues";
import Svg, { Path } from "react-native-svg";
import { theme } from "../utils/theme";
import { useCollectStatue, useGetCollectedStatues } from "../api/queries";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { useLocation } from "../hooks/useLocation";
import { calculateDistance } from "../utils/math";
import { UserInfoContext } from "@/providers/UserInfo";
import { getThumbnailUrl } from "@/utils/images";

const STATUE_DISTANCE_THRESHOLD_METERS = 20;

export const StatueDetail: FC = () => {
  const router = useRouter();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { selectedStatue, setSelectedStatue } = useContext(
    SelectedStatueContext
  );
  const { userInfo } = useContext(UserInfoContext);
  const { data: collectedStatues } = useGetCollectedStatues();
  const collectStatue = useCollectStatue();
  const isLoading = collectStatue.isPending;
  const userLocation = useLocation();

  const handleCollect = useCallback(async () => {
    if (!selectedStatue) {
      throw new Error("No statue selected.");
    }
    router.navigate(`/puzzle?id=${selectedStatue.id}`);
  }, [selectedStatue]);

  const imageUrl = selectedStatue?.id
    ? getThumbnailUrl(selectedStatue.id, 480)
    : undefined;

  const HandleWithImage = useCallback(() => {
    if (!imageUrl) {
      return null;
    }
    return <Handle imageUrl={imageUrl} />;
  }, [imageUrl]);

  const collectedStatue = collectedStatues.find(
    (statue) => statue.statue_id === selectedStatue?.id
  );

  const isCloseEnough = useMemo(() => {
    if (!userLocation || !selectedStatue) return false;

    const distanceKm = calculateDistance(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      selectedStatue.lat,
      selectedStatue.lng
    );

    const distanceMeters = distanceKm * 1000;
    return (
      userInfo?.devMode || distanceMeters <= STATUE_DISTANCE_THRESHOLD_METERS
    );
  }, [userLocation, selectedStatue, userInfo?.devMode]);

  if (!selectedStatue) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backgroundStyle={styles.handleBackground}
      enablePanDownToClose
      onClose={() => setSelectedStatue(null)}
      handleComponent={HandleWithImage}
      snapPoints={["73%", "100%"]}
    >
      <BottomSheetScrollView
        className="bg-gray h-full p-6 gap-6"
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        <View className="gap-6">
          <Text className="text-[22px] font-bold text-white">
            {selectedStatue.name}
          </Text>

          {collectedStatue ? (
            <UnlockedStatueInfo
              collectedAt={collectedStatue.created_at}
              score={collectedStatue.value}
              statue={selectedStatue}
            />
          ) : (
            <View className="gap-6">
              <Text className="text-white">
                Ulov sochu a odemkni si víc informací.
              </Text>

              <TouchableOpacity
                disabled={isLoading || !isCloseEnough}
                onPress={handleCollect}
                className={collectButton({
                  disabled: isLoading || !isCloseEnough,
                })}
              >
                <Text
                  style={{
                    color: theme.white,
                    fontWeight: "bold",
                    fontSize: 17,
                    textAlign: "center",
                  }}
                >
                  {isLoading
                    ? "Nahrávám data"
                    : !isCloseEnough
                      ? `Přibližte se k soše na ${STATUE_DISTANCE_THRESHOLD_METERS} metrů`
                      : "Ulov sochu"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const Handle: FC<{ imageUrl: string }> = ({ imageUrl }) => (
  <View className="border-b-4 border-red-light">
    <View style={styles.handleBackgroundView}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={StyleSheet.absoluteFill}
        imageStyle={styles.handleBlurredBackgroundImage}
        blurRadius={6}
      />
      <ImageBackground
        source={{ uri: imageUrl }}
        style={StyleSheet.absoluteFill}
        imageStyle={styles.handleBackgroundImage}
      />
      <View className="w-32 h-1.5 bg-white/50 rounded-full absolute self-center mt-3 z-10" />
      <LinearGradient
        colors={["rgba(0, 0, 0, .64)", "rgba(0, 0, 0, 0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.4]}
        style={styles.imageOverlay}
      />
    </View>
  </View>
);

type UnlockedStatueInfoProps = {
  collectedAt: string;
  score: number;
  statue: Statue;
};

const UnlockedStatueInfo: FC<UnlockedStatueInfoProps> = ({
  collectedAt,
  score,
  statue,
}) => {
  const { author, description, material, type, year, wiki_url } = statue;

  const formattedDate = new Date(collectedAt).toLocaleDateString("cs-CZ");

  return (
    <View className="gap-6">
      <View className="flex-row gap-2">
        <Badge>{`Uloveno ${formattedDate}`}</Badge>
        <Badge>{`+${score}b`}</Badge>
      </View>

      {description && <Description>{description}</Description>}

      <View className="flex flex-row">
        <View className="flex-1">
          {author && <LabelValueRow label="Autor" value={author} />}
          {year && <LabelValueRow label="Rok vzniku" value={year} />}
          {material && <LabelValueRow label="Materiál" value={material} />}
          {type && <LabelValueRow label="Typ" value={type} />}
        </View>
      </View>

      {wiki_url && (
        <Pressable
          className="flex flex-row gap-2 items-center"
          onPress={() => Linking.openURL(wiki_url)}
        >
          <Text className="text-white underline text-lg">
            Zjistit více v internetové encyklopedii
          </Text>
          <Svg width={20} height={20} viewBox="0 0 17 17">
            <Path
              d="M12.75 7.66416C12.5621 7.66416 12.3819 7.73878 12.2491 7.87162C12.1163 8.00446 12.0416 8.18463 12.0416 8.37249V13.4583C12.0416 13.6462 11.967 13.8264 11.8342 13.9592C11.7013 14.092 11.5212 14.1667 11.3333 14.1667H3.54163C3.35376 14.1667 3.1736 14.092 3.04076 13.9592C2.90792 13.8264 2.83329 13.6462 2.83329 13.4583V5.66666C2.83329 5.47879 2.90792 5.29863 3.04076 5.16579C3.1736 5.03295 3.35376 4.95832 3.54163 4.95832H8.62746C8.81532 4.95832 8.99549 4.8837 9.12833 4.75086C9.26116 4.61802 9.33579 4.43785 9.33579 4.24999C9.33579 4.06213 9.26116 3.88196 9.12833 3.74912C8.99549 3.61628 8.81532 3.54166 8.62746 3.54166H3.54163C2.97804 3.54166 2.43754 3.76554 2.03902 4.16405C1.64051 4.56257 1.41663 5.10307 1.41663 5.66666V13.4583C1.41663 14.0219 1.64051 14.5624 2.03902 14.9609C2.43754 15.3594 2.97804 15.5833 3.54163 15.5833H11.3333C11.8969 15.5833 12.4374 15.3594 12.8359 14.9609C13.2344 14.5624 13.4583 14.0219 13.4583 13.4583V8.37249C13.4583 8.18463 13.3837 8.00446 13.2508 7.87162C13.118 7.73878 12.9378 7.66416 12.75 7.66416ZM15.5266 1.85582C15.4547 1.68274 15.3172 1.5452 15.1441 1.47332C15.059 1.43703 14.9675 1.41778 14.875 1.41666H10.625C10.4371 1.41666 10.2569 1.49128 10.1241 1.62412C9.99125 1.75696 9.91663 1.93713 9.91663 2.12499C9.91663 2.31285 9.99125 2.49302 10.1241 2.62586C10.2569 2.7587 10.4371 2.83332 10.625 2.83332H13.1679L5.87204 10.1221C5.80565 10.1879 5.75296 10.2663 5.71699 10.3526C5.68103 10.4389 5.66252 10.5315 5.66252 10.625C5.66252 10.7185 5.68103 10.8111 5.71699 10.8974C5.75296 10.9837 5.80565 11.0621 5.87204 11.1279C5.93789 11.1943 6.01623 11.247 6.10255 11.283C6.18887 11.3189 6.28145 11.3374 6.37496 11.3374C6.46847 11.3374 6.56105 11.3189 6.64737 11.283C6.73368 11.247 6.81203 11.1943 6.87788 11.1279L14.1666 3.83207V6.37499C14.1666 6.56285 14.2413 6.74302 14.3741 6.87586C14.5069 7.0087 14.6871 7.08332 14.875 7.08332C15.0628 7.08332 15.243 7.0087 15.3758 6.87586C15.5087 6.74302 15.5833 6.56285 15.5833 6.37499V2.12499C15.5822 2.03243 15.5629 1.94098 15.5266 1.85582Z"
              fill="#FFFFFF"
            />
          </Svg>
        </Pressable>
      )}

      <View className="flex flex-row gap-2">
        <Text className="text-white text-lg">
          Chybí ti tu nějaká informace?
        </Text>
        {/* TODO: martin.rodin: Add link to contact form */}
        <Pressable className="flex flex-row gap-2 items-center">
          <Text className="text-white underline text-lg">Napiš nám.</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Description: FC<{ children: ReactNode }> = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const [clampedHeight, setClampedHeight] = useState(0);

  const handleFullLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    setFullHeight(height);
  };

  const handleClampedLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (!expanded) {
      setClampedHeight(height);
    }
  };

  // We compare full height and clamped height to determine if we
  // should show the expand toggle. It's a bit of a hack, but
  // there probably isn't a better way to do this in React Native.
  const showToggle = fullHeight > clampedHeight;

  return (
    <View>
      {/* hidden text to measure full height */}
      <Text
        className="absolute opacity-0 pointer-events-none"
        onLayout={handleFullLayout}
      >
        {children}
      </Text>

      {/* visible text */}
      <Text
        className={description({ expanded })}
        onLayout={handleClampedLayout}
      >
        {children}
      </Text>

      {showToggle && (
        <Pressable onPress={() => setExpanded(!expanded)}>
          <Text className="text-white underline">
            {expanded ? "ZOBRAZIT MÉNĚ" : "ZOBRAZIT VÍCE"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const Badge: FC<{ children: ReactNode }> = ({ children }) => (
  <View className="border-2 border-red-lightest px-3 py-1 rounded-full">
    <Text className="text-red-lightest text-sm font-bold">{children}</Text>
  </View>
);

type LabelValueRowProps = {
  label: string;
  value: string;
};

const LabelValueRow: FC<LabelValueRowProps> = ({ label, value }) => (
  <View className="flex flex-row mb-2.5">
    <Text className="w-32 font-semibold text-white">{label}</Text>
    <Text className="flex-1 text-white">{value}</Text>
  </View>
);

const collectButton = tv({
  base: "bg-red-light justify-center p-4 rounded-full",
  variants: {
    disabled: {
      true: "opacity-50",
    },
  },
});

const description = tv({
  base: "text-white",
  variants: {
    expanded: {
      true: "line-clamp-none",
      false: "line-clamp-3",
    },
  },
});

const HANDLE_BORDER_RADIUS = 50;

// styling for BottomSheet component cannot be fully done using Tailwind,
// so we keep the styles in StyleSheet
const styles = StyleSheet.create({
  handleBackground: {
    borderTopLeftRadius: HANDLE_BORDER_RADIUS,
    borderTopRightRadius: HANDLE_BORDER_RADIUS,
  },
  handleBackgroundView: {
    width: "100%",
    height: 220,
    alignItems: "flex-end",
    paddingTop: 12,
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.greyDarker,
    borderTopLeftRadius: HANDLE_BORDER_RADIUS,
    borderTopRightRadius: HANDLE_BORDER_RADIUS,
  },
  handleBackgroundImage: {
    borderTopLeftRadius: HANDLE_BORDER_RADIUS,
    borderTopRightRadius: HANDLE_BORDER_RADIUS,
    objectFit: "contain",
  },
  handleBlurredBackgroundImage: {
    objectFit: "cover",
  },
  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: 220,
    top: 0,
    left: 0,
    borderTopLeftRadius: HANDLE_BORDER_RADIUS,
    borderTopRightRadius: HANDLE_BORDER_RADIUS,
  },
});
