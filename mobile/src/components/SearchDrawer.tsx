import { View } from "react-native";
import { SearchAddressInput } from "./SearchAddressInput";
import React, { FC, useEffect } from "react";
import { GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";

type SearchDrawerProps = {
  onSelectLocation: (details: { lat: number; lng: number }) => void;
  onClose: () => void;
};

export const SearchDrawer: FC<SearchDrawerProps> = ({
  onSelectLocation,
  onClose,
}) => {
  const inputRef = React.useRef<GooglePlacesAutocompleteRef | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View className="absolute bg-gray py-6 w-full h-[100%] pt-[60px]">
      <View className="flex flex-row justify-between items-center">
        <SearchAddressInput
          ref={inputRef}
          onClose={onClose}
          onSelect={onSelectLocation}
        />
      </View>
    </View>
  );
};
