import { FC } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { theme } from "../utils/theme";

type BackToMapButtonProps = {
  onClose: () => void;
};

export const BackToMapButton: FC<BackToMapButtonProps> = ({ onClose }) => (
  <TouchableOpacity onPress={onClose}>
    <Svg width={8} height={16} viewBox="0 0 10 19">
      <Path
        d="M9 17.5L1 9.5L9 1.5"
        stroke="#DA1E26"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
    <Text style={{ color: theme.red }}>Zpět do mapy</Text>
  </TouchableOpacity>
);
