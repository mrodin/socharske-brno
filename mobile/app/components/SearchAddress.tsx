import React, { useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface Props {
  onSelect: (details: { lat: number; lng: number }) => void;
}

export function SerachAddress({ onSelect }: Props) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      styles={{
        powered: {
          display: "none",
        },
      }}
      onPress={(data, details = null) => {
        if (details?.geometry.location) {
          onSelect({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      fetchDetails={true}
      nearbyPlacesAPI="GoogleReverseGeocoding"
      query={{
        key: "AIzaSyA8TDSZH7TMUjO4t2KI_ThDgTD1_CsdMts",
        language: "cs-CZ",
        types: "geocode",
      }}
    />
  );
}
