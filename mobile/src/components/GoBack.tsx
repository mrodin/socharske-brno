import { cn } from "@/utils/cn";
import { FC } from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

export const GoBack: FC<{ onPress: () => void; className?: string }> = ({
  onPress,
  className,
}) => (
  <TouchableOpacity
    style={{
      paddingVertical: 14,
      paddingRight: 0,
      paddingLeft: 30,
      borderRadius: 5,
    }}
    className={cn("z-10", className)}
    onPress={onPress}
  >
    <Svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <Path
        d="M9 1L1 9L9 17"
        stroke="#FEFBFB"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  </TouchableOpacity>
);
