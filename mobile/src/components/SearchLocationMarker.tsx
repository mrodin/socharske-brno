import { useLocationContext } from "@/providers/LocationProvider";
import { FC } from "react";
import { Geojson, GeojsonProps } from "react-native-maps";

export const SearchLocationMarker: FC = () => {
  const { searchedLocation } = useLocationContext();

  if (!searchedLocation) {
    return null;
  }

  const locationPoint: GeojsonProps["geojson"] = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [searchedLocation.longitude, searchedLocation.latitude],
        },
      },
    ],
  };

  return <Geojson geojson={locationPoint} />;
};
