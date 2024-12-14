import React from "react";
import { TouchableHighlight } from "../TouchableHighlight";
import Svg, { Path } from "react-native-svg";
import { View } from "../../primitives/View";

export const NavigationOpenButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableHighlight
    onPress={onPress}
    underlayColor="#DE4237"
    className="w-[72px] h-[72px] absolute bottom-0 rounded-tl-none rounded-tr-[30px] rounded-b-none bg-gray overflow-auto flex flex-col items-center justify-center pt-[18px] px-3 pb-4 box-border cursor-pointer"
  >
    <View className="flex flex-row items-center justify-start">
      <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <Path
          id="Vector"
          d="M18.1318 18.1317V1.86827M18.1318 1.86827H1.8683M18.1318 1.86827L1.8683 18.1317"
          stroke="#FEFBFB"
          strokeWidth="3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  </TouchableHighlight>
);
