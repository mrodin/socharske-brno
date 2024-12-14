import React from "react";
import { TouchableHighlight } from "./TouchableHighlight";
import Svg, { Path } from "react-native-svg";
import { View } from "./View";
import { Text } from "./Text";

export function CollectionButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      className="w-80 shadow-lg backdrop-blur-md rounded-[38px] opacity-80 bg-gray"
    >
      <View className="flex flex-row gap-x-4 items-center justify-center py-[11px] px-[25px] box-border">
        <Text className="pt-1 leading-[22px] text-[22px] text-gray-pale">
          Ulov svou první sochu!
        </Text>
        <View className="flex flex-row items-start justify-start">
          <Svg width="19" height="29" viewBox="0 0 19 29" fill="none">
            <Path
              d="M17.9 25.2979H17.3V19.7447C17.3 19.3745 17.06 19.1277 16.7 19.1277H12.92L16.04 13.266C16.1 13.1426 16.1 13.0809 16.1 12.9574V10.4894C16.1 8.7617 14.78 7.40425 13.1 7.40425H11.72C12.56 6.35532 13.1 4.87447 13.1 3.70213C13.1 1.66596 11.48 0 9.5 0C7.52 0 5.9 1.66596 5.9 3.70213C5.9 4.87447 6.44 6.35532 7.28 7.40425H5.9C4.22 7.40425 2.9 8.7617 2.9 10.4894V12.9574C2.9 13.0809 2.9 13.1426 2.96 13.266L6.08 19.1277H2.3C1.94 19.1277 1.7 19.3745 1.7 19.7447V25.2979H1.1C0.74 25.2979 0.5 25.5447 0.5 25.9149V28.383C0.5 28.7532 0.74 29 1.1 29H17.9C18.26 29 18.5 28.7532 18.5 28.383V25.9149C18.5 25.5447 18.26 25.2979 17.9 25.2979ZM7.1 3.70213C7.1 2.34468 8.18 1.23404 9.5 1.23404C10.82 1.23404 11.9 2.34468 11.9 3.70213C11.9 5.24468 10.64 7.40425 9.5 7.40425C8.36 7.40425 7.1 5.24468 7.1 3.70213ZM4.1 12.7723V10.4894C4.1 9.44042 4.88 8.6383 5.9 8.6383H13.1C14.12 8.6383 14.9 9.44042 14.9 10.4894V12.7723L11.54 19.1277H7.46L4.1 12.7723ZM2.9 20.3617H16.1V25.2979H2.9V20.3617ZM17.3 27.766H1.7V26.5319H17.3V27.766ZM14.9 20.9787H4.1C3.74 20.9787 3.5 21.2255 3.5 21.5957V24.0638C3.5 24.434 3.74 24.6809 4.1 24.6809H14.9C15.26 24.6809 15.5 24.434 15.5 24.0638V21.5957C15.5 21.2255 15.26 20.9787 14.9 20.9787ZM14.3 23.4468H4.7V22.2128H14.3V23.4468Z"
              fill="#EBEBEB"
            />
          </Svg>
        </View>
      </View>
    </TouchableHighlight>
  );
}
