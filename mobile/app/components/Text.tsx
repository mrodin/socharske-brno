import React from "react";
import { Text as NativeText, TextProps } from "react-native";

export const Text: React.FC<TextProps> = ({ style, ...props }) => (
  <NativeText
    style={[style, { fontFamily: "RethinkSans-Regular" }]}
    {...props}
  />
);

export default Text;
