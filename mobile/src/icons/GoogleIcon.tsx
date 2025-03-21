import * as React from "react";
import { Path, SvgProps, Svg } from "react-native-svg";
import { forwardRef } from "react";

const SvgComponent = (
  props: SvgProps & { className: string },
  ref: React.Ref<any>
) => (
  <Svg width={19} height={22} fill="none" ref={ref} {...props}>
    <Path
      fill="#1F1F1F"
      d="M9.429 8.578h8.9c.098.548.148 1.072.148 1.572 0 1.776-.373 3.361-1.118 4.757a8.066 8.066 0 0 1-3.186 3.272c-1.379.785-2.96 1.178-4.744 1.178a9.268 9.268 0 0 1-3.671-.743 9.43 9.43 0 0 1-3.008-2.007A9.428 9.428 0 0 1 .743 13.6 9.269 9.269 0 0 1 0 9.93C0 8.644.248 7.42.743 6.258A9.428 9.428 0 0 1 2.75 3.25a9.428 9.428 0 0 1 3.008-2.007A9.269 9.269 0 0 1 9.428.5c2.456 0 4.563.823 6.323 2.468l-2.566 2.467c-1.006-.974-2.259-1.46-3.756-1.46a5.633 5.633 0 0 0-2.928.797A5.88 5.88 0 0 0 4.37 6.94a5.9 5.9 0 0 0-.786 2.99c0 1.08.262 2.076.786 2.989a5.88 5.88 0 0 0 2.13 2.167 5.633 5.633 0 0 0 2.928.798 6.26 6.26 0 0 0 1.964-.295c.597-.196 1.088-.442 1.473-.736.385-.295.72-.63 1.007-1.007.286-.377.497-.733.632-1.068.135-.336.227-.655.276-.958H9.43V8.58Z"
    />
  </Svg>
);
export const GoogleIcon = forwardRef(SvgComponent);
