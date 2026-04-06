import { cn } from "@/utils/cn";
import { View } from "react-native";
import { Input, InputProps } from "react-native-elements";

export const StyledInput = (
  props: InputProps & { className?: string; noBorder?: boolean }
) => {
  return (
    <View style={{ marginLeft: -10, marginRight: -10, marginBottom: -24 }}>
      <Input
        {...props}
        className={cn(
          "py-3",
          !props.noBorder && "border-b-[1px] border-white",
          props.className
        )}
        labelStyle={{
          fontWeight: 400,
          lineHeight: 22,
          marginBottom: 5,
          color: "white",
          fontFamily: "Rethink Sans",
        }}
        inputStyle={{
          width: "100%",
          padding: 0,
          margin: 0,
          height: 30,
          color: "white",
        }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          ...props.inputContainerStyle,
        }}
      />
    </View>
  );
};
