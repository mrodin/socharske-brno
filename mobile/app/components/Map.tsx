import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { StyleSheet, View, Image } from "react-native";
import MapView from "react-native-map-clustering";
import * as Location from "expo-location";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { SerachAddress } from "./SearchAddress";
import { useFoundStateuIds, useStatues } from "../api/statues";
import { Statue } from "../types/statues";
import { sortByDistanceFromPoint } from "../utils/math";
import { FoundStatuesContext } from "../providers/FoundStatues";

const brnoRegion = {
  latitude: 49.1951,
  longitude: 16.6068,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const maxNearestStatues = 5;

type MapProps = {
  onSelectStatue: (stateu: Statue) => void;
};

export function Map({ onSelectStatue }: MapProps) {
  const [currentLocation, setCurrentLocation] = useState<any>(brnoRegion);
  const [initialRegion, setInitialRegion] = useState<Region>(brnoRegion);
  const statues = useStatues();
  const [foundStateuIds] = useContext(FoundStatuesContext);

  const nearestStatues = useMemo(() => {
    const allNearest = sortByDistanceFromPoint(statues, {
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
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

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000 },
        (newLocation) => {
          setCurrentLocation(newLocation.coords);

          setInitialRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      );
    })();
  }, []);

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
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
            onPress={() => onSelectStatue(statue)}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={
                foundStateuIds.includes(statue.id)
                  ? require("../../assets/found-state-marker.png")
                  : require("../../assets/uknown-state-marker.png")
              }
            />
          </Marker>
        ))}
      </MapView>
      <View style={styles.search}>
        <SerachAddress
          onSelect={(coord) => {
            setInitialRegion({
              latitude: coord.lat,
              longitude: coord.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }}
        />
      </View>
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
  search: {
    position: "absolute",
    top: 30,
    width: "100%",
    padding: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
