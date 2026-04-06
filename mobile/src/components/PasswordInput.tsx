import { useState } from "react";
import { Pressable, View } from "react-native";
import { InputProps } from "react-native-elements";
import { StyledInput } from "./StyledInput";
import { EyeIcon, EyeOffIcon } from "@/icons/EyeIcon";

export const PasswordInput = (props: InputProps & { className?: string }) => {
  const [hidden, setHidden] = useState(true);

  return (
    <View className="flex-row items-center border-b-[1px] border-white">
      <View className="flex-1">
        <StyledInput {...props} noBorder secureTextEntry={hidden} />
      </View>
      <Pressable
        onPress={() => setHidden((hidden) => !hidden)}
        hitSlop={8}
        style={{ marginRight: 0 }}
      >
        {hidden ? <EyeIcon color="white" /> : <EyeOffIcon color="white" />}
      </Pressable>
    </View>
  );
};
