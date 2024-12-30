import { FC } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { theme } from "../utils/theme";

type BackToMapButtonProps = {
  onClose: () => void;
};

export const BackToMapButton: FC<BackToMapButtonProps> = ({ onClose }) => (
  <TouchableOpacity onPress={onClose} style={styles.layout}>
    <Svg width={8} height={16} viewBox="0 0 10 19" fill="none">
      <Path
        d="M9 17.5L1 9.5L9 1.5"
        stroke="#DA1E26"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
    <Text style={{ color: theme.red, fontSize: 16 }}>Zpět do mapy</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  layout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
