import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { theme } from "../../utils/theme";

interface Props {
  onSelect: (details: { lat: number; lng: number }) => void;
}

export function SearchAddress({ onSelect }: Props) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Hledat adresu..."
      onPress={(data, details) => {
        if (details?.geometry.location) {
          onSelect({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      textInputProps={{
        placeholderTextColor: theme.grey,
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
          flex: 1,
          backgroundColor: theme.greyLight,
          borderTopLeftRadius: 23,
          borderBottomLeftRadius: 23,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          color: theme.redPaler,
          fontSize: 16,
          height: 46,
          paddingHorizontal: 17,
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
          color: theme.redPaler,
        },
        textInputContainer: {},
        poweredContainer: {
          display: "none",
        },
      }}
    />
  );
}
