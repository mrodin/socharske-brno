import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import ClusteredMapView from "react-native-map-clustering";
import { LatLng, Region } from "react-native-maps";

import { DEFAULT_ZOOM } from "@/utils/constants";

type EnhancedMapView = ClusteredMapView & {
  animateToRegion: (region: Region, duration: number) => void;
};

const brnoRegion: Region = {
  latitude: 49.1945072,
  longitude: 16.6105554,
  latitudeDelta: DEFAULT_ZOOM,
  longitudeDelta: DEFAULT_ZOOM,
};

export const LocationContext = createContext<{
  searchText: string;
  setSearchText: (text: string) => void;
  initialRegion: Region;
  mapRef: React.RefObject<EnhancedMapView>;
  searchedLocation: LatLng | null;
  animateToRegion: (latLng: LatLng) => void;
  animateToViewport: (viewport: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  }) => void;
  setSearchedLocation: (latLng: LatLng) => void;
  clearSearchedLocation: () => void;
} | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [searchText, setSearchText] = useState("");
  const [searchedLocation, setSearchedLocation] = useState<LatLng | null>(null);
  const mapRef = useRef<EnhancedMapView | null>(null);

  const animateToRegion = useCallback(
    (latLng: LatLng) => {
      // setTimeout needs to be there to start animation in new event loop.
      // Otherwise, the animateToRegion won't work after routing
      // (switching screens).
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: latLng.latitude,
            longitude: latLng.longitude,
            latitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: DEFAULT_ZOOM,
          },
          500
        );
      }, 0);
    },
    [mapRef]
  );

  const animateToViewport = useCallback(
    (viewport: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    }) => {
      // Calculate center and deltas from viewport bounds
      const latitude = (viewport.northeast.lat + viewport.southwest.lat) / 2;
      const longitude = (viewport.northeast.lng + viewport.southwest.lng) / 2;
      const latitudeDelta =
        Math.abs(viewport.northeast.lat - viewport.southwest.lat) * 1.2;
      const longitudeDelta =
        Math.abs(viewport.northeast.lng - viewport.southwest.lng) * 1.2;

      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          },
          500
        );
      }, 0);
    },
    [mapRef]
  );

  const clearSearchedLocation = useCallback(() => {
    setSearchText("");
    setSearchedLocation(null);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        initialRegion: brnoRegion,
        mapRef,
        searchText,
        searchedLocation,
        animateToRegion,
        animateToViewport,
        setSearchText,
        setSearchedLocation,
        clearSearchedLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }
  return context;
};
