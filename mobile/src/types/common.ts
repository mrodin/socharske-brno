import { StyleProp } from "react-native";
import { supercluster } from "react-native-clusterer";
import { Region } from "react-native-maps";

import { StatueWithDistance } from "./statues";

export type Cluster = {
  cluster: true;
  cluster_id: number;
  getExpansionRegion: () => Region;
  point_count: number;
  point_count_abbreviated: string;
};

export interface Coordinate {
  lat: number;
  lng: number;
}

export type MapPoint = supercluster.PointOrClusterFeature<StatueWithDistance, Cluster>;

export type StyledComponentProps<ComponentStyle> = {
  style?: StyleProp<ComponentStyle>;
  className?: string;
  children?: React.ReactNode;
};
