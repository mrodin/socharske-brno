import * as Location from "expo-location";
import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import {
  Clusterer,
  isPointCluster,
  supercluster,
} from "react-native-clusterer";

import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { sortByDistanceFromPoint } from "../utils/math";
import { theme } from "../utils/theme";
import { useGetAllStatues, useGetCollectedStatues } from "../api/queries";
import { LocationContext } from "@/providers/LocationProvider";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";
import { Point } from "./Point";

const statueDetailOffset = 0.0011;

const maxNearestStatues = 200;

const MAP_WIDTH = Dimensions.get("window").width;
const MAP_HEIGHT = Dimensions.get("window").height - 180;
const MAP_DIMENSIONS = { width: MAP_WIDTH, height: MAP_HEIGHT };

type IFeature = supercluster.PointOrClusterFeature<any, any>;
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
  const { data: collectedStatueIds } = useGetCollectedStatues();

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
      id: statue.id,
    },
  }));

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      // setLocation(location);
    }

    getCurrentLocation();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.log("Permission to access location was denied");
  //       return;
  //     }

  //     // Location.watchPositionAsync(
  //     //   { accuracy: Location.Accuracy.High, timeInterval: 1000 },
  //     //   (newLocation) => {
  //     //     setCurrentLocation(newLocation.coords);

  //     //     setInitialRegion({
  //     //       latitude: newLocation.coords.latitude,
  //     //       longitude: newLocation.coords.longitude,
  //     //       latitudeDelta: 0.005,
  //     //       longitudeDelta: 0.005,
  //     //     });
  //     //   }
  //     // );
  //   })();
  // }, []);

  const _handlePointPress = (point: IFeature) => {
    if (isPointCluster(point)) {
      const toRegion = point.properties.getExpansionRegion();
      mapRef.current?.animateToRegion({ ...toRegion }, 500);
    }
  };

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      onRegionChangeComplete={setRegion}
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
            style={{ width: 40, height: 40 }}
            source={require("../../assets/current-location-marker.png")}
          />
        </Marker>
      )}
      <Clusterer
        data={statuesPoints}
        region={region}
        options={{ radius: 20 }}
        mapDimensions={MAP_DIMENSIONS}
        renderItem={(item) => {
          return (
            <Point
              key={
                isPointCluster(item)
                  ? `cluster-${item.properties.cluster_id}`
                  : `point-${item.properties.id}`
              }
              item={item}
              onPress={_handlePointPress}
            />
          );
        }}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  clusterMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.red,
    justifyContent: "center",
    alignItems: "center",
  },
  clusterText: {
    color: "white",
    fontWeight: "bold",
  },
  foundStateuMarker: { width: 60, height: 60, borderRadius: 30 },
  notFoundStatueMarker: { width: 40, height: 40, borderRadius: 20 },
});
