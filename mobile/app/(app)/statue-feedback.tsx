import { useGetAllStatues, useSendStatueFeedback } from "@/api/queries";
import { Button } from "@/components/Button";
import { GoBack } from "@/components/GoBack";
import { Modal } from "@/components/Modal";
import { TextArea } from "@/components/TextArea";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FC, useState } from "react";
import { View, SafeAreaView, Text } from "react-native";

const StatueFeedback: FC = () => {
  const router = useRouter();
  const { statueId } = useLocalSearchParams<{ statueId: string }>();

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: statueMap } = useGetAllStatues();
  const sendStatueFeedback = useSendStatueFeedback();

  const statueName = statueMap[Number(statueId)].name;

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <View className="relative flex-row justify-center gap-4">
        <GoBack
          className="absolute top-[-10px] left-0"
          onPress={() => router.push("/")}
        />
        <Text className="text-white text-center text-[22px] px-12">
          {statueName}
        </Text>
      </View>

      <View className="justify-center gap-8 pt-16 px-6">
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

        <View className="gap-4">
          <Button
            disabled={message.length === 0}
            onPress={() => {
              sendStatueFeedback.mutate({
                message,
                statueId: Number(statueId),
              });
              setShowModal(true);
            }}
            title="Odeslat"
            variant="primary"
          />

          <Text className="text-white leading-6 text-center">
            Odesláním souhlasím s tím, aby mnou poskytnuté informace byly
            zveřejněné v aplikaci Lovci soch.
          </Text>
        </View>
      </View>

      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <View className="gap-6">
          <Text className="text-[22px] font-semibold text-center">
            Děkujeme!
          </Text>
          <Text className="text-center text-[16px] leading-6">
            Vážíme si, že nám pomáháš doplňovat informace do Lovců soch.
          </Text>

          <Button
            onPress={() => {
              setShowModal(false);
              router.push("/");
            }}
            title="Jasan"
            variant="primary"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StatueFeedback;
