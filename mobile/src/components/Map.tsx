import * as Location from "expo-location";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Image, StyleSheet } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Statue } from "../types/statues";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { sortByDistanceFromPoint } from "../utils/math";
import { theme } from "../utils/theme";
import { useGetAllStatues, useGetCollectedStatues } from "../api/queries";
import { LocationContext } from "@/providers/LocationProvider";

const statueDetailOffset = 0.0011;

const maxNearestStatues = 20;

export function Map() {
  const mapRef = useRef<
    | (MapView & {
        animateToRegion: (region: Region, duration: number) => void;
      })
    | null
  >(null);
  const { initialRegion, activeRegion, setActiveRegion, zoom } =
    useContext(LocationContext);
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [userLocation, setUserLocation] = useState<any>(initialRegion);
  const { data: statues } = useGetAllStatues();
  const { data: collectedStatueIds } = useGetCollectedStatues();

  const nearestStatues = useMemo(() => {
    const allNearest = sortByDistanceFromPoint(statues ?? [], {
      lat: activeRegion.latitude,
      lng: activeRegion.longitude,
    });
    return allNearest.slice(0, maxNearestStatues);
  }, [userLocation, statues]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

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
    })();
  }, []);

  useEffect(() => {
    console.log("activeRegion", activeRegion);
    if (mapRef.current) {
      // mapRef.current.animateToRegion(
      //   { ...activeRegion, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      //   1000
      // );
    }
  }, [activeRegion]);

  useEffect(() => {
    console.log("map mounted");
    return () => {
      console.log("map unmounted");
    };
  }, []);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={initialRegion}
      region={activeRegion}
      // onRegionChangeComplete={(region) => {
      //   setActiveRegion({
      //     latitude: region.latitude,
      //     longitude: region.longitude,
      //     latitudeDelta: activeRegion.latitudeDelta, // Keep existing zoom
      //     longitudeDelta: activeRegion.longitudeDelta, // Keep existing zoom
      //   });
      // }}
      // onRegionChangeComplete={(region, details) =>
      //   console.log("regionChange", region, details)
      // }
      customMapStyle={customGoogleMapStyle}
      zoomControlEnabled={false}
      clusterColor={"#DA1E27"}
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
      {nearestStatues.map((statue) => (
        <Marker
          key={statue.id}
          coordinate={{
            latitude: statue.lat,
            longitude: statue.lng,
          }}
          onPress={() => {
            setSelectedStatue(statue);
            setActiveRegion({
              latitude: statue.lat,
              longitude: statue.lng,
              latitudeDelta: zoom,
              longitudeDelta: zoom,
            });
          }}
        >
          <Image
            style={[
              selectedStatue?.id === statue.id
                ? { borderWidth: 2, borderColor: theme.red }
                : {},
              collectedStatueIds.includes(statue.id)
                ? styles.foundStateuMarker
                : styles.notFoundStatueMarker,
            ]}
            source={
              collectedStatueIds.includes(statue.id)
                ? {
                    uri: statue.imgthumbnail,
                  }
                : require("../../assets/uknown-state-marker.png")
            }
          />
        </Marker>
      ))}
    </MapView>
  );
}

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
  foundStateuMarker: { width: 60, height: 60, borderRadius: 30 },
  notFoundStatueMarker: { width: 40, height: 40, borderRadius: 20 },
});
