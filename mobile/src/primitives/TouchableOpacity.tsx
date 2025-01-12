import { remapProps } from "nativewind";
import {
  TouchableOpacity as NativeTouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { FC } from "react";

export const TouchableOpacity: FC<TouchableOpacityProps> = ({
  style,
  ...props
}) => {
  return <NativeTouchableOpacity style={style} {...props} />;
};

remapProps(NativeTouchableOpacity, {
  className: "style",
});
