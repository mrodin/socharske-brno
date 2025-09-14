import { FC, useEffect } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";

import { useGetLeaderboard } from "@/api/queries";
import { RouteHeader } from "@/components/RouteHeader";
import { Player } from "@/components/Player";
import { Title } from "@/components/Title";
import { router } from "expo-router";
import { track } from "@amplitude/analytics-react-native";

const LeaderBoard: FC = () => {
  const { data: leaderboard } = useGetLeaderboard();

  useEffect(() => {
    track("Page View", { page: "Leaderboard" });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-gray flex-1 gap-8 px-6 mt-3">
          <Title className="text-gray-pale text-[20px] tracking-wide">
            Nejlepší lovci soch
          </Title>

          <View className="gap-4">
            {leaderboard.map((user, index) => (
              <Player
                onPress={() => {
                  router.navigate(`/leaderboard/profile?id=${user.id}`);
                }}
                key={user.id}
                isWinner={index === 0}
                name={user.username}
                score={user.score.toFixed()}
                thumbnail={user.avatar}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderBoard;
