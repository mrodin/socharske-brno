import { remapProps } from "nativewind";
import { FC } from "react";
import {
  TouchableHighlight as NativeTouchableHighlight,
  TouchableHighlightProps,
} from "react-native";

export const TouchableHighlight: FC<TouchableHighlightProps> = ({
  style,
  ...props
}) => <NativeTouchableHighlight style={style} {...props} />;

remapProps(TouchableHighlight, {
  className: "style",
});
