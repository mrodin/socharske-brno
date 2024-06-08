import * as Location from "expo-location";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Image, StyleSheet } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker, Region } from "react-native-maps";
import { useStatues } from "../api/statues";
import { FoundStatuesContext } from "../providers/FoundStatues";
import { Statue } from "../types/statues";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { sortByDistanceFromPoint } from "../utils/math";
import { theme } from "../utils/theme";

const brnoRegion = {
  latitude: 49.1759324,
  longitude: 16.5630407,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const statueDetailOffset = 0.0011;

const maxNearestStatues = 20;

type MapProps = {
  initialRegion?: Region;
  setInitialRegion: (region: Region) => void;
  onSelectStatue: (stateu: Statue) => void;
  selectedStatue: Statue | null;
};

export function Map({
  initialRegion,
  setInitialRegion,
  onSelectStatue,
  selectedStatue,
}: MapProps) {
  const [currentLocation, setCurrentLocation] = useState<any>(brnoRegion);
  const statues = useStatues();
  const [foundStateuIds] = useContext(FoundStatuesContext);

  const nearestStatues = useMemo(() => {
    const allNearest = sortByDistanceFromPoint(statues, {
      lat: brnoRegion.latitude,
      lng: brnoRegion.longitude,
    });
    return allNearest.slice(0, maxNearestStatues);
  }, [currentLocation, statues]);

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
    <>
      <MapView
        // TODO: fix provider on iOS
        // provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={initialRegion}
        //onRegionChange={(region) => console.log(region)}
        customMapStyle={customGoogleMapStyle}
        zoomControlEnabled={false}
        clusterColor={"#DA1E27"}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
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
              setInitialRegion({
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
                foundStateuIds.includes(statue.id)
                  ? styles.foundStateuMarker
                  : styles.notFoundStatueMarker,
              ]}
              source={
                foundStateuIds.includes(statue.id)
                  ? {
                      uri: statue.imgthumbnail,
                    }
                  : require("../../assets/uknown-state-marker.png")
              }
            />
          </Marker>
        ))}
      </MapView>
    </>
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
