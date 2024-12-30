import { Pressable as PressableNative, PressableProps } from "react-native";
import { remapProps } from "nativewind";
import { FC } from "react";

const Pressable: FC<PressableProps> = ({ style, ...props }) => (
  <PressableNative style={style} {...props} />
);

remapProps(Pressable, {
  className: "style",
});
