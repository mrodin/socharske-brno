import * as React from "react";
import { Path, SvgProps, Svg } from "react-native-svg";
import { forwardRef } from "react";

const SvgComponent = (
  props: SvgProps & { className: string },
  ref: React.Ref<any>
) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    ref={ref}
    {...props}
  >
    <Path
      d="M1 1.46086L7 5.99999L1 10.5391"
      stroke={props.color}
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);
export const ArrowRight = forwardRef(SvgComponent);
