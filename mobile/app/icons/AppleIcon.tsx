import * as React from "react";
import { Path, SvgProps } from "react-native-svg";
import { forwardRef } from "react";
import { Svg } from "../primitives/Svg";

const SvgComponent = (props: SvgProps, ref: React.Ref<any>) => (
  <Svg width={18} height={23} ref={ref} {...props}>
    <Path
      fill="#1F1F1F"
      d="M12.084 4.04c.378-.444.666-.96.848-1.519a4.555 4.555 0 0 0 .212-1.735 4.41 4.41 0 0 0-3 1.55A4.28 4.28 0 0 0 9.33 3.81a4.337 4.337 0 0 0-.187 1.68 3.629 3.629 0 0 0 1.635-.375c.51-.251.956-.619 1.305-1.074Zm2.52 7.593c.006-.782.208-1.55.586-2.23a4.56 4.56 0 0 1 1.574-1.658 4.694 4.694 0 0 0-1.594-1.462 4.59 4.59 0 0 0-2.066-.579c-1.56-.163-3 .929-3.83.929-.83 0-2-.909-3.3-.888a4.849 4.849 0 0 0-2.404.734 4.978 4.978 0 0 0-1.736 1.847c-1.76 3.123-.45 7.766 1.31 10.286.8 1.235 1.8 2.633 3.12 2.582 1.32-.051 1.75-.837 3.28-.837 1.53 0 2 .837 3.3.806 1.3-.03 2.22-1.265 3.06-2.5a11.319 11.319 0 0 0 1.38-2.908 4.432 4.432 0 0 1-1.945-1.652 4.566 4.566 0 0 1-.735-2.47Z"
    />
  </Svg>
);
const ForwardRef = forwardRef(SvgComponent);
export default ForwardRef;
