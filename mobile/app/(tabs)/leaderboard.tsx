import { FC } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";

import { useGetLeaderboard } from "@/api/queries";
import { RouteHeader } from "@/components/RouteHeader";
import { Player } from "@/components/Player";
import { Title } from "@/components/Title";
import { UserTag } from "@/components/UserTag";
import { Winner } from "@/components/Winner";
import { router } from "expo-router";

const AdamImage = require("../../assets/images/adam.jpeg");
const KubaImage = require("../../assets/images/kuba.jpeg");
const PepeImage = require("../../assets/images/pepe.jpeg");

const images: any = {
  "117faf40-2317-42f7-a8a7-680b7a37c1b7": PepeImage,
  "11fc039a-1999-48c3-bc8b-2683b1eb4cdb": KubaImage,
  "40379104-5e6a-4b79-a17b-54da5fd3d2a7": AdamImage,
};

const LeaderBoard: FC = () => {
  const { data: leaderboard } = useGetLeaderboard();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-gray flex-1 gap-8 px-6">
          <RouteHeader route="Leaderboard" />

          <Title className="text-gray-pale text-[20px] tracking-wide">
            Nejlepší lovci soch
          </Title>

          <View className="gap-4">
            {leaderboard.map((user, index) => (
              <Player
                key={user.id}
                isWinner={index === 0}
                name={user.username}
                score={user.score.toFixed()}
                thumbnail={images[user.id]}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderBoard;
