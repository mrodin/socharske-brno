import { remapProps } from "nativewind";
import { FC } from "react";
import {
  Input as NativeInput,
  InputProps as NativeInputProps,
} from "react-native-elements";

export const Input: FC<NativeInputProps> = (props) => (
  <NativeInput
    className={
      "w-full relative rounded-full bg-primary-palest h-[50px] flex flex-row justify-start py-2.5 px-5 box-border text-left text-[16px] text-gray-gray font-rethink-sans"
    }
    // probably could be done by extending the NativeInputProps type in future
    //@ts-ignore
    labelClassName="text-white text-[16px] font-bold"
    containerClassName="p-0 flex m-0"
    inputContainerClassName="p-0 m-0 border-none"
    {...props}
  />
);

const NativewindInput: FC<NativeInputProps> = ({
  style,
  labelStyle,
  containerStyle,
  inputContainerStyle,
  ...props
}) => (
  <NativeInput
    style={style}
    labelStyle={labelStyle}
    containerStyle={containerStyle}
    inputContainerStyle={inputContainerStyle}
    {...props}
  />
);

remapProps(NativewindInput, {
  className: "style",
  labelClassName: "labelStyle",
  containerClassName: "containerStyle",
  inputContainerClassName: "inputContainerStyle",
});
