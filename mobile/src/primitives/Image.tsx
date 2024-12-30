import { remapProps } from "nativewind";
import React, { FC } from "react";
import { ImageProps, Image as NativeImage } from "react-native";

const Image: FC<ImageProps> = ({ style, ...props }) => {
  return <NativeImage style={style} {...props} />;
};

remapProps(Image, {
  className: "style",
});
