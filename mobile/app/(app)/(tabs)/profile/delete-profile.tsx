import { useState, useContext, useCallback } from "react";
import { View, Text, Alert, TextInput } from "react-native";

import { Button } from "@/components/Button";
import { router } from "expo-router";
import { track } from "@amplitude/analytics-react-native";
import { UserSessionContext } from "@/providers/UserSession";
import { supabase } from "@/utils/supabase";

const MAX_MESSAGE_LENGTH = 500;

const DeleteProfile = () => {
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"intro" | "confirm">("intro");
  const [submitting, setSubmitting] = useState(false);
  const { session } = useContext(UserSessionContext);

  const handleConfirm = useCallback(async () => {
    if (submitting || !session) return;

    track("Profile Delete - Confirmed");

    setSubmitting(true);
    try {
      // Delete profile via Supabase Function
      const { error } = await supabase.functions.invoke("delete-profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ message }),
      });
      if (!error) {
        router.replace("/sign-out");
      } else {
        track("Profile Delete - Error", { error: error.message });
        Alert.alert("Chyba při mazání účtu", error.message);
      }
    } catch (e: any) {
      track("Profile Delete - Error", { error: e?.message });
      Alert.alert("Neočekávaná chyba", e?.message || "Zkus to prosím znovu.");
    } finally {
      setSubmitting(false);
    }
  }, [session, message, submitting]);

  const goToConfirm = () => {
    setStep("confirm");
  };

  return (
    <View className="gap-5 p-5 pt-10 flex align-center justify-center h-full">
      {step === "intro" ? (
        <>
          <View className="gap-1 items-center">
            <Text className="text-white text-lg">
              Opravdu chceš smazat svůj účet?
            </Text>
            <Text className="text-white text-lg">
              Mrzí nás, že odcházíš. :(
            </Text>
          </View>
          <View className="gap-5 text-center items-center">
            <Button
              variant="primary"
              title="Smazat účet"
              onPress={goToConfirm}
            />
            <Button
              variant="secondary"
              title="Dát lovcům druhou šanci"
              onPress={() => router.back()}
            />
          </View>
        </>
      ) : (
        <>
          <Text className="text-white text-lg text-center">
            Moc prosíme, napiš nám důvod, proč odcházíš. Tvoje zpětná vazba je
            pro nás důležitá a pomůže nám ve zlepšování aplikace.
          </Text>
          <TextInput
            editable
            multiline
            value={message}
            maxLength={MAX_MESSAGE_LENGTH}
            readOnly={submitting}
            placeholder="Důvod, proč chci smazat účet (dobrovolné)"
            onChangeText={setMessage}
            className="bg-white h-[120px] p-5 rounded-lg text-lg "
          />
          <View className="gap-5 text-center items-center">
            <Button
              variant="primary"
              title={submitting ? "Mažu účet..." : "Potvrdit smazání účtu"}
              onPress={handleConfirm}
              disabled={submitting}
            />
            <Button
              variant="secondary"
              title="Dát lovcům druhou šanci"
              onPress={() => router.back()}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default DeleteProfile;
