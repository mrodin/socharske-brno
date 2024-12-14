import React from "react";
import { TouchableHighlight } from "../TouchableHighlight";
import Svg, { Path } from "react-native-svg";

export const NavigationCloseButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor="#DE4237"
      className="w-[84px] h-[84px] flex items-center justify-center rounded-tr-[30px]"
    >
      <Svg width="33" height="33" viewBox="0 0 33 33" fill="none">
        <Path
          d="M8.13167 8.36827V24.6317M8.13167 24.6317H24.3951M8.13167 24.6317L24.3951 8.36827"
          stroke="#FEFBFB"
          strokeWidth="3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableHighlight>
  );
};
