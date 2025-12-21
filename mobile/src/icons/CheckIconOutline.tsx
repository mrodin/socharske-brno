import Svg, { Path } from "react-native-svg";

export const CheckIconOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <Svg fill="none" viewBox="0 0 24 24" width={24} height={24}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="white"
      strokeWidth={2}
      d="M6 12l4 4L18 8"
    />
  </Svg>
);
