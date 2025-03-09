import * as React from "react";
import { Path, SvgProps, Svg } from "react-native-svg";
import { forwardRef } from "react";

const SvgComponent = (
  props: SvgProps & { className: string },
  ref: React.Ref<any>
) => (
  <Svg width={16} height={13} fill="none" ref={ref} {...props}>
    <Path
      fill="#1F1F1F"
      d="M0 1.91037V1.5C0 1.23478 0.105357 0.98043 0.292893 0.792893C0.48043 0.605357 0.734784 0.5 1 0.5H15C15.2652 0.5 15.5196 0.605357 15.7071 0.792893C15.8946 0.98043 16 1.23478 16 1.5V1.91037L8 6.91038L0 1.91037ZM8.265 7.92413C8.18551 7.97374 8.0937 8.00004 8 8.00004C7.9063 8.00004 7.81449 7.97374 7.735 7.92413L0 3.08962V11.5C0 11.7652 0.105357 12.0196 0.292893 12.2071C0.48043 12.3946 0.734784 12.5 1 12.5H15C15.2652 12.5 15.5196 12.3946 15.7071 12.2071C15.8946 12.0196 16 11.7652 16 11.5V3.08962L8.265 7.92413Z"
    />
  </Svg>
);
export const MailIcon = forwardRef(SvgComponent);
