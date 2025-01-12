import { View } from "react-native";
import { Input, InputProps } from "react-native-elements";

export const StyledInput = (props: InputProps & { className?: string }) => {
  return (
    <View style={{ marginLeft: -10, marginRight: -10, marginBottom: -24 }}>
      <Input
        {...props}
        className={
          "bg-white px-5 py-3 rounded-full border-none " + props.className
        }
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
          height: 50,
        }}
        inputContainerStyle={{ borderBottomWidth: 0 }}
      />
    </View>
  );
};
