import { createContext, ReactNode, useCallback, useRef } from "react";
import ClusteredMapView from "react-native-map-clustering";
import { LatLng, Region } from "react-native-maps";

import { DEFAULT_ZOOM } from "@/utils/constants";

type EnhancedMapView = ClusteredMapView & {
  animateToRegion: (region: Region, duration: number) => void;
};

const brnoRegion: Region = {
  latitude: 49.1759324,
  longitude: 16.5630407,
  latitudeDelta: DEFAULT_ZOOM,
  longitudeDelta: DEFAULT_ZOOM,
};

export const LocationContext = createContext<{
  animateToRegion: (latLng: LatLng) => void;
  initialRegion: Region;
  mapRef: React.RefObject<EnhancedMapView>;
}>({
  animateToRegion: () => {},
  initialRegion: brnoRegion,
  mapRef: { current: null },
});

export function LocationProvider({ children }: { children: ReactNode }) {
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

  return (
    <LocationContext.Provider
      value={{
        animateToRegion,
        initialRegion: brnoRegion,
        mapRef,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
