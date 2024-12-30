import { StyleProp } from "react-native";

export interface Coordinate {
  lat: number;
  lng: number;
}

export type StyledComponentProps<ComponentStyle> = {
  style?: StyleProp<ComponentStyle>;
  className?: string;
  children?: React.ReactNode;
};
