import { Svg as NativeSvg, SvgProps } from "react-native-svg";
import { remapProps } from "nativewind";
import { FC } from "react";

const Svg: FC<SvgProps> = ({ style, ...props }) => (
  <NativeSvg style={style} {...props} />
);

remapProps(NativeSvg, {
  className: "style",
});
