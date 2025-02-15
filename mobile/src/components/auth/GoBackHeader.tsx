import { ArrowLeft } from "@/icons/ArrowLeft";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const GoBackHeader = () => {
  const router = useRouter();
  return (
    <View className="mb-10 mt-1">
      <Pressable
        className="text-white py-2 self-start flex-row items-center"
        onPress={() => router.back()}
      >
        <ArrowLeft width={10} />
        <Text className="text-white ml-3">zpět</Text>
      </Pressable>
    </View>
  );
};

export default GoBackHeader;
