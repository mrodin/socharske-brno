import { FC } from "react";
import { Text, TextInput, TextInputProps } from "react-native";

type TextAreaProps = TextInputProps & {
  error?: string;
};

export const TextArea: FC<TextAreaProps> = ({ error, ...props }) => (
  <>
    <TextInput
      multiline
      textAlignVertical="top"
      className="bg-white rounded-lg p-4 text-[16px] min-h-[120px]"
      placeholderTextColor="#9CA3AF"
      {...props}
    />
    {error && <Text className="text-red-500 text-[12px] mt-1">{error}</Text>}
  </>
);
