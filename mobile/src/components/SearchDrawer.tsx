import { View } from "react-native";
import { SearchAddressInput } from "./SearchAddressInput";
import React, { FC, useContext, useEffect } from "react";
import { GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { LocationContext } from "@/providers/LocationProvider";
import { router } from "expo-router";
import { track } from "@amplitude/analytics-react-native";

type SearchDrawerProps = {};

export const SearchDrawer: FC<SearchDrawerProps> = ({}) => {
  const inputRef = React.useRef<GooglePlacesAutocompleteRef | null>(null);
  const { animateToRegion } = useContext(LocationContext);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View className="absolute bg-gray py-6 w-full h-[100%] pt-[60px]">
      <View className="flex flex-row justify-between items-center">
        <SearchAddressInput
          ref={inputRef}
          onClose={() => {
            router.back();
          }}
          onSelect={({ lng, lat }) => {
            track("Search Location Selected", {
              latitude: lat,
              longitude: lng,
            });
            router.navigate("/");
            animateToRegion({ latitude: lat, longitude: lng });
          }}
        />
      </View>
    </View>
  );
};
