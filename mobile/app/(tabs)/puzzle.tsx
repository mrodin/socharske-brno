import { FC, useEffect, useRef } from "react";
import { View, SafeAreaView, Text } from "react-native";

import {
  useCollectStatue,
  useGetAllStatues,
  useGetCollectedStatues,
} from "@/api/queries";
import { router, useLocalSearchParams } from "expo-router";
import { Puzzle as PuzzleGame } from "@/components/puzzle/Puzzle";
import { GoBack } from "@/components/GoBack";

const Puzzle: FC = () => {
  const { data: statues = [] } = useGetAllStatues();
  const { id } = useLocalSearchParams<{ id: string }>();
  const statueId = Number(id);
  const statue = statues.find((statue) => statue.id === statueId);

  const { refetch: refetchStatueIds } = useGetCollectedStatues();
  const collectStatue = useCollectStatue();

  const onComplete = async () => {
    await collectStatue.mutate(statueId);
    await refetchStatueIds();
    router.back();
  };

  if (!statue || !statue.image_url) {
    // It can happen that the user was removed from the leaderboard
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Socha nenalezena</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <GoBack onPress={router.back} className="absolute top-10 left-0 z-10" />
      <View className="flex flex-row items-center gap-4">
        <Text className="text-white text-lg text-center w-full ">
          Vyreš puzzle a odemkni sochu
        </Text>
      </View>

      <PuzzleGame imageUrl={statue.image_url} onComplete={onComplete} />
    </SafeAreaView>
  );
};

export default Puzzle;
