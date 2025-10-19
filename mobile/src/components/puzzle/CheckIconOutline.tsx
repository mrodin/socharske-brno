import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export const CheckIconOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <View className="absolute top-1 right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
    <Svg fill="none" viewBox="0 0 24 24" width={24} height={24}>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="white"
        strokeWidth={2}
        d="M6 12l4 4L18 8"
      />
    </Svg>
  </View>
);
