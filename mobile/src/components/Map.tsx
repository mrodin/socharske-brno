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
import { Dimensions, Image, View } from "react-native";
import { Clusterer, isPointCluster } from "react-native-clusterer";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

import { LocationContext } from "@/providers/LocationProvider";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { MapPoint as MapPointType } from "@/types/common";
import { DEFAULT_ZOOM } from "@/utils/constants";

import { useGetAllStatues, useGetCollectedStatues } from "../api/queries";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { calculateDistance } from "../utils/math";

import { MapPoint } from "./MapPoint";
import { GpsButton } from "./GpsButton";
import { track } from "@amplitude/analytics-react-native";

const MAP_WIDTH = Dimensions.get("window").width;
const MAP_HEIGHT = Dimensions.get("window").height - 96;
const MAP_DIMENSIONS = { width: MAP_WIDTH, height: MAP_HEIGHT };

type EnhancedMapView = MapView & {
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
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [statue.lng, statue.lat],
      },
      properties: {
        ...statue,
        distance: userLocation
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              statue.lat,
              statue.lng
            )
          : undefined,
        isCollected: collectedStatueIds.has(statue.id),
      },
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
    (point: MapPointType) => {
      if (isPointCluster(point)) {
        const region = point.properties.getExpansionRegion();
        goToRegion(region);
      } else {
        setSelectedStatue(point.properties);
      }
    },
    [goToRegion, setSelectedStatue]
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

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000 },
      (newLocation) => {
        setUserLocation(newLocation.coords);
      }
    );

    getCurrentLocation();
  }, []);

  // goes to the region of the search
  useEffect(() => {
    goToRegion(searchRegion);
  }, [goToRegion, searchRegion]);

  // additional elements needs to be rendered outside of the MapView
  // otherwise cause issues with positioning.
  return (
    <View className="size-full relative">
      <MapView
        ref={mapRef}
        customMapStyle={customGoogleMapStyle}
        initialRegion={initialRegion}
        onRegionChangeComplete={setRegion}
        provider={PROVIDER_GOOGLE}
        style={MAP_DIMENSIONS}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
          >
            <Image
              className="w-12 h-12"
              source={require("../../assets/current-location-marker.png")}
            />
          </Marker>
        )}
        <Clusterer
          data={statuesPoints}
          region={region}
          options={{ radius: 30 }}
          mapDimensions={MAP_DIMENSIONS}
          renderItem={(point) => (
            <MapPoint
              key={
                isPointCluster(point)
                  ? `cluster-${point.properties.cluster_id}`
                  : `point-${point.properties.id}`
              }
              onPress={onMapPointPress}
              point={point}
            />
          )}
        />
      </MapView>
      <GpsButton
        onPress={() => {
          track("Gps Button Click");
          goToRegion(region);
        }}
      />
    </View>
  );
};
