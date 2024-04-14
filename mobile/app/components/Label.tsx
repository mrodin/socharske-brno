import { FC, ReactNode } from "react";
import { Text, StyleSheet, View } from "react-native";
import { theme } from "../utils/theme";

type LabelProps = {
  children: ReactNode;
  backgroundColor?: string;
  stroke?: number;
  strokeColor?: string;
  fontColor?: string;
};

export const Label: FC<LabelProps> = ({
  children,
  backgroundColor = "transparent",
  stroke = 1,
  strokeColor = theme.grey,
  fontColor = theme.grey,
}) => (
  <View
    style={{
      backgroundColor,
      borderWidth: stroke,
      borderColor: strokeColor,
      borderRadius: 50,
      paddingHorizontal: 16,
      paddingVertical: 12,
    }}
  >
    <Text style={{ fontSize: 12, color: fontColor }}>{children}</Text>
  </View>
);
