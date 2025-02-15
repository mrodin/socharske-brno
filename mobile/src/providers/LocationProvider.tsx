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
  activeRegion: Region;
  setActiveRegion: Dispatch<SetStateAction<Region>>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
}>({
  initialRegion: brnoRegion,
  activeRegion: brnoRegion,
  setActiveRegion: () => {},
  zoom: DEFAULT_ZOOM,
  setZoom: () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [activeRegion, setActiveRegion] = useState<Region>(brnoRegion);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);

  return (
    <LocationContext.Provider
      value={{
        initialRegion: brnoRegion,
        activeRegion,
        setActiveRegion,
        zoom,
        setZoom,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
