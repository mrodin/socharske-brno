import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Region } from "react-native-maps";

const DEFAULT_ZOOM = 0.01;

const brnoRegion: Region = {
  latitude: 49.1759324,
  longitude: 16.5630407,
  latitudeDelta: DEFAULT_ZOOM,
  longitudeDelta: DEFAULT_ZOOM,
};

export const LocationContext = createContext<{
  initialRegion: Region;
  searchRegion: Region;
  setSearchRegion: Dispatch<SetStateAction<Region>>;
}>({
  initialRegion: brnoRegion,
  searchRegion: brnoRegion,
  setSearchRegion: () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [searchRegion, setSearchRegion] = useState<Region>(brnoRegion);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);

  return (
    <LocationContext.Provider
      value={{
        initialRegion: brnoRegion,
        searchRegion,
        setSearchRegion,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
