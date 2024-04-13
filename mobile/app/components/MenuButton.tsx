import React from "react";
import { TouchableHighlight, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

export function MenuButton({ onPress }: { onPress: () => void }) {
  const size = 54;
  return (
    <TouchableHighlight onPress={onPress} style={{ borderRadius: size / 2 }}>
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: "#D9D9D9",
          borderColor: "#3D3D3D",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: size / 2,
        }}
      >
        <Svg width={54} height={54} viewBox="0 0 54 54">
          <Circle cx="27" cy="27" r="27" fill="none" />
          <Line
            x1="15"
            y1="27.5"
            x2="39"
            y2="27.5"
            stroke="#494949"
            stroke-width="3"
          />
          <Line
            x1="15"
            y1="34.5"
            x2="39"
            y2="34.5"
            stroke="#494949"
            stroke-width="3"
          />
          <Line
            x1="15"
            y1="20.5"
            x2="39"
            y2="20.5"
            stroke="#494949"
            stroke-width="3"
          />
        </Svg>
      </View>
    </TouchableHighlight>
  );
}
