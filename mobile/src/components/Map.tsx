import * as Location from "expo-location";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, View } from "react-native";
import ClusteredMapView from "react-native-map-clustering";
import {
  Geojson,
  GeojsonProps,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import { useLocationContext } from "@/providers/LocationProvider";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";

import { useGetAllStatues, useGetCollectedStatues } from "../api/queries";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";

import { GpsButton } from "./GpsButton";
import { track } from "@amplitude/analytics-react-native";
import { StatuePoint } from "@/types/statues";
import { StatueMarker } from "./StatueMarker";
import { SearchLocationMarker } from "./SearchLocationMarker";
import {
  locationPermissionAlert,
  useLocationPermission,
  PermissionStatus,
} from "@/utils/permissions";

export const Map: FC = () => {
  const {
    initialRegion,
    mapRef,
    animateToRegion,
    clearSearchedLocation,
    userLocation,
  } = useLocationContext();
  const { selectedStatue, setSelectedStatue } = useContext(
    SelectedStatueContext
  );

  const locationPermission = useLocationPermission();

  // heading (compass direction) of the user
  const [userHeading, setUserHeading] = useState<number | undefined>(undefined);
  // track which collected statue images have loaded - to optimize Marker re-renders
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  // track if we've done the initial map animation to user's location
  const hasAnimatedToInitialLocation = useRef(false);
  // last reported heading value for throttling (5° threshold)
  const lastReportedHeading = useRef<number>(0);

  const { data: statueMap } = useGetAllStatues();
  const { data: collectedStatues = [] } = useGetCollectedStatues();

  const statuesPoints = useMemo(() => {
    // create a Set of collected statue IDs for O(1) lookup
    const collectedStatueIds = new Set(
      collectedStatues.map((cs) => cs.statue_id)
    );

    return (
      Object.values(statueMap)
        // collected statues are always visible, others depend on their 'visible' property
        .filter((statue) => collectedStatueIds.has(statue.id) || statue.visible)
        .map(
          (statue) =>
            ({
              ...statue,
              latitude: statue.lat,
              longitude: statue.lng,
              distance: undefined,
              isCollected: collectedStatueIds.has(statue.id),
            }) satisfies StatuePoint
        )
    );
  }, [collectedStatues, statueMap]);

  const onMapPointPress = useCallback(
    (statue: StatuePoint) => {
      setSelectedStatue(statue);
      clearSearchedLocation();
    },
    [setSelectedStatue, clearSearchedLocation]
  );

  // Animate to user location on first available position
  useEffect(() => {
    if (userLocation && !hasAnimatedToInitialLocation.current) {
      animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
      hasAnimatedToInitialLocation.current = true;
    }
  }, [userLocation, animateToRegion]);

  // Throttled heading watcher - only updates state when heading
  // changes by 5+ degrees. Without this, heading fires at 10-60 Hz
  // and saturates the JS thread on low-end Android devices.
  useEffect(() => {
    const headingSubscription = Location.watchHeadingAsync((headingData) => {
      const heading =
        headingData.trueHeading !== -1
          ? headingData.trueHeading
          : headingData.magHeading;

      const delta = Math.abs(heading - lastReportedHeading.current);
      // Account for wrap-around at 360°
      if (delta > 5 && delta < 355) {
        lastReportedHeading.current = heading;
        setUserHeading(heading);
      }
    });

    return () => {
      headingSubscription.then((sub) => sub.remove());
    };
  }, []);

  // additional elements needs to be rendered outside of the MapView
  // otherwise cause issues with positioning.
  return (
    <View className="size-full relative">
      <ClusteredMapView
        ref={mapRef}
        customMapStyle={customGoogleMapStyle}
        initialRegion={initialRegion}
        // provider={PROVIDER_GOOGLE} Temporarily disabled for testing
        style={{ width: "100%", height: "100%" }}
        radius={40}
        extent={512}
        nodeSize={64}
        clusterColor="#8B8B8B"
        clusterTextColor="#FFFFFF"
      >
        {statuesPoints.map((statue) => (
          <Marker
            key={`point-${statue.id}`}
            coordinate={{
              latitude: statue.latitude,
              longitude: statue.longitude,
            }}
            onPress={() => onMapPointPress(statue)}
            anchor={{ x: 0.5, y: 0.5 }}
            calloutOffset={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={
              (statue.isCollected && !loadedImages.has(statue.id)) ||
              statue.id === selectedStatue?.id
            }
          >
            <StatueMarker
              statue={statue}
              highlighted={statue.id === selectedStatue?.id}
              setLoadedImages={setLoadedImages}
            />
          </Marker>
        ))}
        {userLocation && (
          <Marker
            {...{ cluster: false }}
            tracksViewChanges={false}
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ zIndex: 1000 }} // nativewind not working here
            flat={true}
          >
            <Image
              className="w-[60px] h-[60px]"
              source={require("../../assets/current-location.png")}
              style={{
                transform: [{ rotate: `${userHeading ?? 0}deg` }],
              }}
            />
          </Marker>
        )}
        <SearchLocationMarker />
      </ClusteredMapView>
      <GpsButton
        onPress={() => {
          if (userLocation) {
            track("Gps Button Click");
            animateToRegion({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            });
          } else if (locationPermission === PermissionStatus.Denied) {
            locationPermissionAlert();
          }
        }}
      />
    </View>
  );
};
