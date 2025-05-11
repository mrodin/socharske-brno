import Svg, { Path } from "react-native-svg";
import { View, TouchableOpacity } from "react-native";
import { FC } from "react";

type GpsButtonProps = {
  onPress: () => void;
};

export const GpsButton: FC<GpsButtonProps> = ({onPress}) => {
  return (
    <View className="absolute bottom-4 right-4 w-[46px] h-[46px] flex justify-center items-center bg-gray-light rounded-[23px]">
      <TouchableOpacity 
        onPress={onPress}
        className="w-full h-full flex justify-center items-center"
      >
        <Svg width="16" height="18" viewBox="0 0 16 18" fill="none">
          <Path
            d="M8.00006 5.49396C6.16269 5.49396 4.66748 7.067 4.66748 9.00001C4.66748 10.9331 6.16269 12.5061 8.00006 12.5061C9.83745 12.5061 11.3326 10.9331 11.3326 9.00001C11.3326 7.067 9.83745 5.49396 8.00006 5.49396ZM8.00006 11.5257C6.67595 11.5257 5.59937 10.393 5.59937 9.00001C5.59937 7.60698 6.67595 6.47436 8.00006 6.47436C9.32417 6.47436 10.4008 7.60698 10.4008 9.00001C10.4008 10.393 9.32417 11.5257 8.00006 11.5257Z"
            fill="#FDF2F2"
          />
          <Path
            d="M14.6578 8.5098C14.4285 5.0279 11.7757 2.23702 8.46605 1.99571V0.666672H7.53419V1.99571C4.22454 2.23702 1.57172 5.0279 1.34238 8.5098H0.0791016V9.49017H1.34238C1.57172 12.9721 4.22451 15.763 7.53416 16.0043V17.3333H8.46602V16.0043C11.7757 15.763 14.4285 12.9721 14.6578 9.49021H15.9211V8.50984H14.6578V8.5098ZM8.00011 15.0413C4.83409 15.0413 2.25775 12.3308 2.25775 9C2.25775 5.66918 4.83409 2.95873 8.00011 2.95873C11.1661 2.95873 13.7425 5.66918 13.7425 9C13.7425 12.3308 11.1661 15.0413 8.00011 15.0413Z"
            fill="#FDF2F2"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};
