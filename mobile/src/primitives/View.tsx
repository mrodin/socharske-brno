import { remapProps } from "nativewind";
import { FC } from "react";
import { View as NativeView, ViewStyle } from "react-native";
import { StyledComponentProps } from "../types/common";

export const View: FC<StyledComponentProps<ViewStyle>> = ({
  style,
  ...props
}) => {
  return <NativeView style={style} {...props} />;
};

remapProps(View, { className: "style" });
