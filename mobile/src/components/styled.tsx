import { cssInterop } from "nativewind";
import LinearGradientOriginal from "react-native-linear-gradient";
import { SearchBar as SearchBarOriginal } from "react-native-elements";

// Enhanced components with NativeWind className support via cssInterop
// Import these instead of the original components to use className prop
export const LinearGradient = cssInterop(LinearGradientOriginal, {
  className: "style",
});

export const SearchBar = cssInterop(SearchBarOriginal, {
  containerClassName: "containerStyle",
  inputContainerClassName: "inputContainerStyle",
  inputClassName: "inputStyle",
  leftIconContainerClassName: "leftIconContainerStyle",
  rightIconContainerClassName: "rightIconContainerStyle",
});
