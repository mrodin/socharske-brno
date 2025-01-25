import { remapProps } from "nativewind";
import { Text as NativeText, TextStyle } from "react-native";
import { StyledComponentProps } from "../types/common";
import { FC } from "react";

const Text: FC<StyledComponentProps<TextStyle>> = ({ style, ...props }) => {
  return <NativeText style={style} {...props} />;
};

remapProps(Text, { className: "style" });
