import { useSendStatueFeedback } from "@/api/queries";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { GoBack } from "@/components/GoBack";
import { TextArea } from "@/components/TextArea";
import { FC, useState } from "react";
import { View, SafeAreaView, Text } from "react-native";

const Contact: FC = () => {
  const [message, setMessage] = useState("");
  const [hasConsented, setHasConsented] = useState(false);

  const sendStatueFeedback = useSendStatueFeedback();

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <GoBack onPress={() => {}} className="absolute top-10 left-0 z-10" />

      <View className="flex-1 flex-col justify-center gap-8 px-6">
        <Text className="text-[22px] font-bold text-white text-center">
          Máš nějaké informace o soše?
        </Text>
        <Text className="text-white text-[16px] leading-6 text-center">
          Víš o soše něco, co by nám v Lovcích soch nemělo chybět? Napiš nám to!
        </Text>

        <TextArea
          onChangeText={setMessage}
          placeholder="Popiš informace o soše..."
          value={message}
        />

        <Checkbox
          checked={hasConsented}
          label="Souhlasím s tím, aby mnou poskytnuté informace byly zveřejněné v aplikaci Lovci soch."
          onPress={() => setHasConsented(!hasConsented)}
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
