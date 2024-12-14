import * as React from "react";
import { Path, SvgProps } from "react-native-svg";
import { forwardRef } from "react";
import { Svg } from "../primitives/Svg";

const SvgComponent = (
  props: SvgProps & { className?: string },
  ref: React.Ref<any>
) => (
  <Svg
    width={20}
    height={36}
    viewBox="0 0 20 36"
    fill="none"
    ref={ref}
    {...props}
  >
    <Path
      d="M18 2L2 18L18 34"
      stroke="#FDF2F2"
      strokeWidth="4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const ArrowLeft = forwardRef(SvgComponent);
