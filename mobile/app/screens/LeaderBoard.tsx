import { View, SafeAreaView, StyleSheet } from "react-native";
import { useGetLeaderboard } from "../api/queries";
import { BackToMapButton } from "../components/BackToMapButton";
import { UserTag } from "../components/UserTag";
import { Title } from "../primitives/Title";
import { Winner } from "../components/Winner";
import { Player } from "../components/Player";

const AdamImage = require("../../assets/images/adam.jpeg");
const KubaImage = require("../../assets/images/kuba.jpeg");
const PepeImage = require("../../assets/images/pepe.jpeg");

const images: any = {
  "117faf40-2317-42f7-a8a7-680b7a37c1b7": PepeImage,
  "11fc039a-1999-48c3-bc8b-2683b1eb4cdb": KubaImage,
  "40379104-5e6a-4b79-a17b-54da5fd3d2a7": AdamImage,
};

export function LeaderBoard({ onClose }: { onClose: () => void }) {
  const { data: leaderboard } = useGetLeaderboard();

  return (
    <SafeAreaView>
      <View style={{ gap: 30 }}>
        <View style={styles.row}>
          <BackToMapButton onClose={onClose} />
          <UserTag />
        </View>
        <View style={styles.row}>
          <Title>Nejlepší lovci soch</Title>
        </View>
        <View style={styles.entries}>
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
}

const styles = StyleSheet.create({
  entries: {
    paddingHorizontal: 24,
    gap: 16,
  },
  row: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
