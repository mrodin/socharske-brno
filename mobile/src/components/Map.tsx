import * as Location from "expo-location";
import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, Image } from "react-native";
import { Clusterer, isPointCluster } from "react-native-clusterer";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

import { LocationContext } from "@/providers/LocationProvider";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { MapPoint } from "@/types/common";

import { useGetAllStatues, useGetCollectedStatues } from "../api/queries";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { sortByDistanceFromPoint } from "../utils/math";
import { Point } from "./Point";

const statueDetailOffset = 0.0011;

const maxNearestStatues = 200;

const MAP_WIDTH = Dimensions.get("window").width;
const MAP_HEIGHT = Dimensions.get("window").height - 96;
const MAP_DIMENSIONS = { width: MAP_WIDTH, height: MAP_HEIGHT };

type EnhancedMapView = MapView & {
  animateToRegion: (region: Region, duration: number) => void;
};

export const Map: FC = () => {
  const mapRef = useRef<EnhancedMapView | null>(null);

  const { initialRegion, searchRegion, setSearchRegion } =
    useContext(LocationContext);
  const { selectedStatue, setSelectedStatue } = useContext(
    SelectedStatueContext
  );

  const [userLocation, setUserLocation] = useState<any>(initialRegion);
  const [region, setRegion] = useState<Region>(searchRegion);

  const { data: statues } = useGetAllStatues();

  const nearestStatues = useMemo(() => {
    const allNearest = sortByDistanceFromPoint(statues ?? [], {
      lat: searchRegion.latitude,
      lng: searchRegion.longitude,
    });
    return allNearest.slice(0, maxNearestStatues);
  }, [userLocation, statues]);

  const statuesPoints = statues.map((statue) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [statue.lng, statue.lat],
    },
    properties: {
      ...statue,
    },
  }));

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      // setRegion(location);
    };

    // Location.watchPositionAsync(
    //   { accuracy: Location.Accuracy.High, timeInterval: 1000 },
    //   (newLocation) => {
    //     setCurrentLocation(newLocation.coords);

    //     setInitialRegion({
    //       latitude: newLocation.coords.latitude,
    //       longitude: newLocation.coords.longitude,
    //       latitudeDelta: 0.005,
    //       longitudeDelta: 0.005,
    //     });
    //   }
    // );

    getCurrentLocation();
  }, []);

  const handlePointPress = (point: MapPoint) => {
    if (isPointCluster(point)) {
      const toRegion = point.properties.getExpansionRegion();
      mapRef.current?.animateToRegion({ ...toRegion }, 500);
    } else {
      setSelectedStatue(point.properties);
    }
  };

  return (
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
          <Point
            key={
              isPointCluster(point)
                ? `cluster-${point.properties.cluster_id}`
                : `point-${point.properties.id}`
            }
            point={point}
            onPress={handlePointPress}
          />
        )}
      />
    </MapView>
  );
};
