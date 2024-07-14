import React from "react";
import { TouchableHighlight } from "react-native";

import { View } from "./View";
import Svg, { Path } from "react-native-svg";

export function DrawerCloseButton({ onPress }: { onPress: () => void }) {
  const size = 32;
  return (
    <TouchableHighlight onPress={onPress} style={{ borderRadius: size / 2  }} underlayColor="#DE4237">
      <View
        style={{ width: size, height: size }}
        className="origin-top-left -rotate-180 justify-start items-center flex"
      >
        <Svg width={size} height={size} viewBox="0 0 30 30">
          <Path
            d="M10.2349 18.9399C9.92383 19.2509 9.91748 19.8032 10.2412 20.1269C10.5713 20.4506 11.1235 20.4443 11.4282 20.1396L15.186 16.3818L18.9375 20.1332C19.2549 20.4506 19.8008 20.4506 20.1245 20.1269C20.4482 19.7968 20.4482 19.2573 20.1309 18.9399L16.3794 15.1884L20.1309 11.4306C20.4482 11.1132 20.4546 10.5673 20.1245 10.2436C19.8008 9.91987 19.2549 9.91987 18.9375 10.2372L15.186 13.9887L11.4282 10.2372C11.1235 9.92621 10.5649 9.91352 10.2412 10.2436C9.91748 10.5673 9.92383 11.1259 10.2349 11.4306L13.9863 15.1884L10.2349 18.9399Z"
            fill="#FEFBFB"
          />
        </Svg>
      </View>
    </TouchableHighlight>
  );
}
