import { FC } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";

import { useGetLeaderboard } from "@/api/queries";
import { BackToMapButton } from "@/components/BackToMapButton";
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

type LeaderBoardProps = {};

const LeaderBoard: FC<LeaderBoardProps> = () => {
  const { data: leaderboard } = useGetLeaderboard();

  return (
    <SafeAreaView>
      <View className="gap-6">
        <View className="flex flex-row justify-between items-center px-6">
          <BackToMapButton onClose={() => router.push("/")} />
          <UserTag />
        </View>
        <View className="flex flex-row justify-between items-center px-6">
          <Title>Nejlepší lovci soch</Title>
        </View>
        <View className="gap-4 px-6">
          {leaderboard.map((user, index) => {
            if (index === 0) {
              return (
                <Winner
                  key={user.id}
                  name={user.username}
                  score={user.score.toFixed()}
                  thumbnail={images[user.id]}
                />
              );
            }
            return (
              <Player
                key={user.id}
                name={user.username}
                score={user.score.toFixed()}
                thumbnail={images[user.id]}
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LeaderBoard;
