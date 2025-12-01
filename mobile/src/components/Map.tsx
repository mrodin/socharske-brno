import { Image as ExpoImage } from "expo-image";
import * as Location from "expo-location";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Image, Text, View } from "react-native";
import ClusteredMapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { LocationContext } from "@/providers/LocationProvider";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";

import { useGetAllStatues, useGetCollectedStatues } from "../api/queries";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { calculateDistance, formatDistance } from "../utils/math";

import { GpsButton } from "./GpsButton";
import { track } from "@amplitude/analytics-react-native";
import { UndiscoveredStatueIcon } from "@/icons/UndiscoveredStatueIcon";
import { StatueWithDistance } from "@/types/statues";
import { getThumbnailUrl } from "@/utils/images";

export const Map: FC = () => {
  const { animateToRegion, initialRegion, mapRef } =
    useContext(LocationContext);
  const { setSelectedStatue } = useContext(SelectedStatueContext);

  // location of the user marker
  const [userLocation, setUserLocation] = useState<
    Location.LocationObjectCoords | undefined
  >(undefined);
  // heading (compass direction) of the user
  const [userHeading, setUserHeading] = useState<number | undefined>(undefined);
  // track which collected statue images have loaded - to optimize Marker re-renders
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const { data: statueMap } = useGetAllStatues();
  const { data: collectedStatues = [] } = useGetCollectedStatues();

  const statuesPoints = useMemo(() => {
    // create a Set of collected statue IDs for O(1) lookup
    const collectedStatueIds = new Set(
      collectedStatues.map((cs) => cs.statue_id)
    );

    return Object.values(statueMap)
      .filter((statue) => statue.visible)
      .map((statue) => ({
        ...statue,
        latitude: statue.lat,
        longitude: statue.lng,
        distance: userLocation
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              statue.lat,
              statue.lng
            )
          : undefined,
        isCollected: collectedStatueIds.has(statue.id),
      }));
  }, [collectedStatues, statueMap, userLocation]);

  const onMapPointPress = useCallback(
    (statue: StatueWithDistance) => {
      setSelectedStatue(statue);
    },
    [setSelectedStatue]
  );

  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      setUserLocation(location.coords);
      animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    const subscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        // Enable heading updates
        distanceInterval: 0,
      },
      (newLocation) => {
        setUserLocation(newLocation.coords);
        // Update heading if available
        if (newLocation.coords.heading !== null) {
          setUserHeading(newLocation.coords.heading);
        }
      }
    );

    getCurrentLocation();

    return () => {
      subscription.then((sub) => sub.remove());
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
        provider={PROVIDER_GOOGLE}
        style={{ width: "100%", height: "100%" }}
        radius={40}
        extent={512}
        nodeSize={64}
        clusterColor="#8B8B8B"
        clusterTextColor="#FFFFFF"
      >
        {userLocation && (
          <Marker
            tracksViewChanges={false}
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={userHeading || 0}
            flat={true}
          >
            <Image
              className="w-[60px] h-[60px]"
              source={require("../../assets/current-location.png")}
            />
          </Marker>
        )}
        {statuesPoints.map((statue) =>
          statue.isCollected ? (
            <Marker
              key={`point-${statue.id}`}
              coordinate={{
                latitude: statue.latitude,
                longitude: statue.longitude,
              }}
              onPress={() => onMapPointPress(statue)}
              anchor={{ x: 0.5, y: 0.5 }}
              calloutOffset={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={!loadedImages.has(statue.id)} // optimization to stop re-rendering after image loads
            >
              <View className="w-16 h-16 rounded-full border-2 border-red overflow-hidden">
                <ExpoImage
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: getThumbnailUrl(statue.id, 96) }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  onLoad={() => {
                    setLoadedImages((prev) => new Set(prev).add(statue.id));
                  }}
                />
              </View>
            </Marker>
          ) : (
            <Marker
              key={`point-${statue.id}`}
              coordinate={{
                latitude: statue.latitude,
                longitude: statue.longitude,
              }}
              onPress={() => onMapPointPress(statue)}
              anchor={{ x: 0.5, y: 0.5 }}
              calloutOffset={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View className="w-20 h-48 items-center justify-center">
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
              </View>
            </Marker>
          )
        )}
      </ClusteredMapView>
      <GpsButton
        onPress={() => {
          if (userLocation) {
            track("Gps Button Click");
            animateToRegion({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            });
          }
        }}
      />
    </View>
  );
};
