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
import { Image, Text, View } from "react-native";
import ClusteredMapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

import { LocationContext } from "@/providers/LocationProvider";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { DEFAULT_ZOOM } from "@/utils/constants";

import { useGetAllStatues, useGetCollectedStatues } from "../api/queries";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { calculateDistance, formatDistance } from "../utils/math";

import { GpsButton } from "./GpsButton";
import { track } from "@amplitude/analytics-react-native";
import { UndiscoveredStatueIcon } from "@/icons/UndiscoveredStatueIcon";
import { StatueWithDistance } from "@/types/statues";

type EnhancedMapView = ClusteredMapView & {
  animateToRegion: (region: Region, duration: number) => void;
};

export const Map: FC = () => {
  const mapRef = useRef<EnhancedMapView | null>(null);

  const { initialRegion, searchRegion } = useContext(LocationContext);
  const { setSelectedStatue } = useContext(SelectedStatueContext);

  // location of the user marker
  const [userLocation, setUserLocation] = useState<
    Location.LocationObjectCoords | undefined
  >(undefined);
  // heading (compass direction) of the user
  const [userHeading, setUserHeading] = useState<number | undefined>(undefined);
  // region of the map (might not be centered on the user)
  const [region, setRegion] = useState<Region>(searchRegion);

  const { data: statues } = useGetAllStatues();
  const { data: collectedStatues = [] } = useGetCollectedStatues();

  const statuesPoints = useMemo(() => {
    // create a Set of collected statue IDs for O(1) lookup
    const collectedStatueIds = new Set(
      collectedStatues.map((cs) => cs.statue_id)
    );

    return statues.map((statue) => ({
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
  }, [collectedStatues, statues, userLocation]);

  const goToRegion = useCallback(
    (region: Region) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 500);
      }
    },
    [mapRef]
  );

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
      goToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: DEFAULT_ZOOM,
        longitudeDelta: DEFAULT_ZOOM,
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

  // goes to the region of the search
  useEffect(() => {
    goToRegion(searchRegion);
  }, [goToRegion, searchRegion]);

  // additional elements needs to be rendered outside of the MapView
  // otherwise cause issues with positioning.
  return (
    <View className="size-full relative">
      <ClusteredMapView
        ref={mapRef}
        customMapStyle={customGoogleMapStyle}
        initialRegion={initialRegion}
        onRegionChangeComplete={setRegion}
        provider={PROVIDER_GOOGLE}
        style={{ width: "100%", height: "100%" }}
        radius={40}
        extent={512}
        nodeSize={64}
        clusterColor="#8B8B8B"
        clusterTextColor="#FFFFFF"
        spiralEnabled={false}
        animationEnabled={false}
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
            tracksViewChanges={false}
          >
            {statue.isCollected ? (
              <Image
                className="rounded-full h-16 w-16 border-2 border-red"
                source={{
                  uri: `${process.env.EXPO_PUBLIC_IMAGES_STORAGE_URL}/${statue.id}/thumb96/1.JPEG`,
                }}
              />
            ) : (
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
            )}
          </Marker>
        ))}
      </ClusteredMapView>
      <GpsButton
        onPress={() => {
          if (userLocation) {
            track("Gps Button Click");
            const userRegion = {
              ...userLocation,
              latitudeDelta: DEFAULT_ZOOM,
              longitudeDelta: DEFAULT_ZOOM,
            };
            goToRegion(userRegion);
          }
        }}
      />
    </View>
  );
};
