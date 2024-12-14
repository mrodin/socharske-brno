import { styled } from "nativewind";
import {
  Input as NativeInput,
  InputProps as NativeInputProps,
} from "react-native-elements";

export const Input = styled(
  (props: NativeInputProps) => (
    <NativeInput
      labelStyle={{ color: "#fefbfb", padding: 0, margin: 0 }}
      containerStyle={{ padding: 0, display: "flex", margin: 0 }}
      inputContainerStyle={{
        padding: 0,
        margin: 0,
        borderBottomWidth: 0,
        borderBottomColor: "transparent",
      }}
      {...props}
    />
  ),
  "w-full relative rounded-full bg-primary-palest h-[50px] flex flex-row justify-start py-2.5 px-5 box-border text-left text-[16px] text-gray-gray font-rethink-sans"
);
