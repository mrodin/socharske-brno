import React, { forwardRef, useEffect, useMemo } from "react";
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { TouchableOpacity, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SearchAddressInputProps {
  onClose: () => void;
  onSelect: (details: { lat: number; lng: number }) => void;
}

export const SearchAddressInput = forwardRef<
  GooglePlacesAutocompleteRef,
  SearchAddressInputProps
>(({ onClose, onSelect }, ref) => {
  const goBackButton = useMemo(
    () => () => {
      return (
        <TouchableOpacity
          style={{
            paddingVertical: 14,
            paddingRight: 0,
            paddingLeft: 30,
            borderRadius: 5,
          }}
          onPress={onClose}
        >
          <Svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <Path
              d="M9 1L1 9L9 17"
              stroke="#FEFBFB"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      );
    },
    [onClose]
  );

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder="Hledat adresu"
      onPress={(_, details) => {
        if (details?.geometry.location) {
          onSelect({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      textInputProps={{
        placeholderTextColor: "#999999",
        returnKeyType: "search",
      }}
      fetchDetails={true}
      nearbyPlacesAPI="GoogleReverseGeocoding"
      query={{
        key: process.env.EXPO_PUBLIC_NEARBY_PLACES_API,
        language: "cs-CZ",
        types: "geocode",
        components: "country:cz",
      }}
      renderRow={renderResultRow}
      renderLeftButton={goBackButton}
      //suppressDefaultStyles
      styles={{
        textInput: {
          flex: 1,
          backgroundColor: "#393939",
          color: "white",
          fontSize: 16,
          height: 46,
          paddingHorizontal: 17,
        },
        row: {
          backgroundColor: "#393939B3",
        },
        separator: {
          backgroundColor: "#6F6F6F",
        },
        listView: {
          backgroundColor: "none",
          borderRadius: 0,
        },
        description: {
          color: "#6F6F6F",
        },
        textInputContainer: {},
        poweredContainer: {
          display: "none",
        },
      }}
    />
  );
});

const renderResultRow = (data: GooglePlaceData, index: number) => {
  return (
    <View key={index} className="flex flex-row gap-4 px-4 py-1.5">
      <Svg width="13" height="18" viewBox="0 0 13 18" fill="none">
        <Path
          d="M6.0717 0.5C4.46139 0.5 2.91703 1.1397 1.77836 2.27836C0.639695 3.41703 0 4.96139 0 6.5717C0 12.2427 5.46453 17.1425 5.67097 17.349C5.78177 17.4463 5.92422 17.5 6.0717 17.5C6.21919 17.5 6.36163 17.4463 6.47244 17.349C6.70923 17.1425 12.1434 12.2427 12.1434 6.5717C12.1434 5.77436 11.9864 4.98482 11.6812 4.24816C11.3761 3.51151 10.9289 2.84217 10.365 2.27836C9.80124 1.71455 9.1319 1.26731 8.39524 0.962181C7.65859 0.657049 6.86905 0.5 6.0717 0.5ZM6.0717 16.0557C4.85736 14.8414 1.21434 10.8523 1.21434 6.5717C1.21434 5.28345 1.7261 4.04796 2.63703 3.13703C3.54796 2.2261 4.78345 1.71434 6.0717 1.71434C7.35996 1.71434 8.59545 2.2261 9.50638 3.13703C10.4173 4.04796 10.9291 5.28345 10.9291 6.5717C10.9291 10.8219 7.28604 14.8231 6.0717 16.0557Z"
          fill="#6F6F6F"
        />
        <Path
          d="M6.07175 4.14307C5.5914 4.14307 5.12184 4.28551 4.72245 4.55237C4.32305 4.81924 4.01176 5.19855 3.82794 5.64233C3.64412 6.08612 3.59602 6.57444 3.68973 7.04556C3.78345 7.51668 4.01475 7.94943 4.35441 8.28908C4.69407 8.62874 5.12682 8.86005 5.59794 8.95376C6.06906 9.04747 6.55738 8.99938 7.00116 8.81556C7.44495 8.63174 7.82426 8.32045 8.09112 7.92105C8.35799 7.52166 8.50043 7.0521 8.50043 6.57175C8.50043 5.92762 8.24455 5.30988 7.78909 4.85441C7.33362 4.39894 6.71588 4.14307 6.07175 4.14307ZM6.07175 7.78609C5.83158 7.78609 5.59679 7.71487 5.3971 7.58143C5.1974 7.448 5.04176 7.25835 4.94984 7.03646C4.85793 6.81456 4.83389 6.5704 4.88074 6.33484C4.9276 6.09928 5.04325 5.88291 5.21308 5.71308C5.38291 5.54325 5.59928 5.4276 5.83484 5.38074C6.0704 5.33388 6.31457 5.35793 6.53646 5.44984C6.75835 5.54175 6.948 5.6974 7.08144 5.8971C7.21487 6.09679 7.28609 6.33157 7.28609 6.57175C7.28609 6.89381 7.15815 7.20268 6.93042 7.43042C6.70268 7.65815 6.39381 7.78609 6.07175 7.78609Z"
          fill="#6F6F6F"
        />
      </Svg>

      <Text className="text-gray-lighter">{data.description}</Text>
    </View>
  );
};
