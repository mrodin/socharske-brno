import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { theme } from "../utils/theme";

interface Props {
  onSelect: (details: { lat: number; lng: number }) => void;
}

export function SerachAddress({ onSelect }: Props) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        if (details?.geometry.location) {
          onSelect({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      textInputProps={{
        placeholderTextColor: theme.redPale,
        returnKeyType: "search",
      }}
      fetchDetails={true}
      nearbyPlacesAPI="GoogleReverseGeocoding"
      query={{
        key: process.env.EXPO_PUBLIC_NEARBY_PLACES_API,
        language: "cs-CZ",
        types: "geocode",
      }}
      styles={{
        textInput: {
          backgroundColor: "#393939B3",
          borderRadius: 25,
          height: 38,
          color: theme.redPale,
          fontSize: 16,
        },
        row: {
          backgroundColor: "#393939B3",
        },
        separator: {
          backgroundColor: "#393939",
        },
        listView: {
          backgroundColor: "none",
          borderRadius: 15,
        },
        description: {
          color: theme.redPale,
        },
        textInputContainer: {},
        poweredContainer: {
          display: "none",
        },
      }}
    />
  );
}
