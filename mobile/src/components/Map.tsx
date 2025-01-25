import * as Location from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Statue } from "../types/statues";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { sortByDistanceFromPoint } from "../utils/math";
import { theme } from "../utils/theme";
import { useGetAllStatues, useGetCollectedStatues } from "../api/queries";

const statueDetailOffset = 0.0011;

const maxNearestStatues = 20;

type MapProps = {
  initialRegion: Region;
  onSelectStatue: (stateu: Statue) => void;
  selectedStatue: Statue | null;
};

export function Map({
  initialRegion,
  onSelectStatue,
  selectedStatue,
}: MapProps) {
  const [activeMarkerLocation, setActiveMarkerLocation] =
    useState<any>(initialRegion);
  const { data: statues } = useGetAllStatues();
  const { data: collectedStatueIds } = useGetCollectedStatues();

  const nearestStatues = useMemo(() => {
    const allNearest = sortByDistanceFromPoint(statues ?? [], {
      lat: initialRegion.latitude,
      lng: initialRegion.longitude,
    });
    return allNearest.slice(0, maxNearestStatues);
  }, [activeMarkerLocation, statues]);

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

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={initialRegion}
      //onRegionChange={(region) => console.log(region)}
      customMapStyle={customGoogleMapStyle}
      zoomControlEnabled={false}
      clusterColor={"#DA1E27"}
    >
      {activeMarkerLocation && (
        <Marker
          coordinate={{
            latitude: activeMarkerLocation.latitude,
            longitude: activeMarkerLocation.longitude,
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
            onSelectStatue(statue);
            setActiveMarkerLocation({
              latitude: statue.lat - statueDetailOffset,
              longitude: statue.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005 - statueDetailOffset,
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
                ? // ? {
                  //     uri: statue.imgthumbnail,
                  //   }
                  // TODO: martin.rodin: Replace with actual image
                  require("../../assets/found-state-marker.png")
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
