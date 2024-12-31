import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Region } from "react-native-maps";

const brnoRegion: Region = {
  latitude: 49.1759324,
  longitude: 16.5630407,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const LocationContext = createContext<{
  originRegion: Region;
  setOriginRegion: Dispatch<SetStateAction<Region>>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
}>({
  originRegion: brnoRegion,
  setOriginRegion: () => {},
  zoom: 0.01,
  setZoom: () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [originRegion, setOriginRegion] = useState<Region>(brnoRegion);
  const [zoom, setZoom] = useState<number>(0.01);

  return (
    <LocationContext.Provider value={{ originRegion, setOriginRegion, zoom, setZoom }}>
      {children}
    </LocationContext.Provider>
  );
}
