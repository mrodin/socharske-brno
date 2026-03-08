import { View } from "react-native";
import { SearchAddressInput } from "./SearchAddressInput";
import React, { FC, useEffect } from "react";
import { GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { useLocationContext } from "@/providers/LocationProvider";
import { router } from "expo-router";
import { track } from "@amplitude/analytics-react-native";

type SearchDrawerProps = {};

export const SearchDrawer: FC<SearchDrawerProps> = ({}) => {
  const inputRef = React.useRef<GooglePlacesAutocompleteRef | null>(null);
  const {
    searchText,
    setSearchText,
    animateToRegion,
    animateToViewport,
    setSearchedLocation,
    clearSearchedLocation,
  } = useLocationContext();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View className="absolute bg-gray py-6 w-full h-[100%] pt-[60px]">
      <View className="flex flex-row justify-between items-center">
        <SearchAddressInput
          ref={inputRef}
          searchText={searchText}
          setSearchText={setSearchText}
          onClose={() => {
            router.back();
          }}
          onClear={() => {
            clearSearchedLocation();
          }}
          onSelect={({ location, viewport }) => {
            track("Search Location Selected", {
              latitude: location.lat,
              longitude: location.lng,
            });
            setSearchedLocation({
              latitude: location.lat,
              longitude: location.lng,
            });
            router.navigate("/");
            if (viewport) {
              animateToViewport(viewport);
            } else {
              animateToRegion({
                latitude: location.lat,
                longitude: location.lng,
              });
            }
          }}
        />
      </View>
    </View>
  );
};
