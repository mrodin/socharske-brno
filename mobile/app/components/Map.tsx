import React, { useCallback, useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { Button } from "react-native-elements";
import customGoogleMapStyle from "../utils/customGoogleMapStyle.json";
import { SerachAddress } from "./SearchAddress";

const brnoRegion = {
  latitude: 49.1951,
  longitude: 16.6068,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const Map = () => {
  const [currentLocation, setCurrentLocation] = useState<any>(brnoRegion);
  const [initialRegion, setInitialRegion] = useState<Region>(brnoRegion);

  // const getCurrentLocation = useCallback(() => {
  //   const getLocation = async () => {
  //     console.log("Hello");
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.log("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setCurrentLocation(location.coords);
  //     setInitialRegion({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //       latitudeDelta: 0.005,
  //       longitudeDelta: 0.005,
  //     });
  //   };

  //   getLocation();
  // }, []);

  return (
    <>
      <MapView
        googleMapId="5aac85797b449be1"
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={initialRegion}
        onRegionChange={(region) => console.log(region)}
        customMapStyle={customGoogleMapStyle}
        zoomControlEnabled={false}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
          />
        )}
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
