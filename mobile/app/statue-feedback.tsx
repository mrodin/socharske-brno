import { useSendStatueFeedback } from "@/api/queries";
import { Button } from "@/components/Button";
import { FC, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TextInputProps,
} from "react-native";

interface TextAreaProps extends TextInputProps {
  error?: string;
}

const TextArea: FC<TextAreaProps> = ({ error, ...props }) => {
  return (
    <View className="w-full px-6">
      <TextInput
        multiline
        textAlignVertical="top"
        className="bg-white rounded-lg p-4 text-[16px] min-h-[120px]"
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 text-[12px] mt-1">{error}</Text>}
    </View>
  );
};

const Contact: FC = () => {
  const [message, setMessage] = useState("");

  const sendStatueFeedback = useSendStatueFeedback();

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <View className="flex-1 flex-col justify-center gap-6">
        <Text className="text-[22px] font-bold text-white text-center">
          Máš nějaké informace o soše?
        </Text>
        <Text className="text-white text-[16px] leading-6 text-center px-6">
          Víš o soše něco, co by nám v Lovcích soch nemělo chybět? Napiš nám to!
        </Text>

        <TextArea
          placeholder="Popiš informace o soše..."
          value={message}
          onChangeText={setMessage}
        />

        <Button
          title="Odeslat"
          onPress={() => sendStatueFeedback.mutate({ message, statueId: 123 })}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
};

export default Contact;
