import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { useLeaderBoard } from "../api/statues";
import { BackToMapButton } from "../components/BackToMapButton";
import { UserTag } from "../components/UserTag";
import { Title } from "../components/Title";

export function LeaderBoard({ onClose }: { onClose: () => void }) {
  const users = useLeaderBoard();

  console.log(users);

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
      </View>
      <Text>Leader board</Text>
      {users.map((user) => (
        <View key={user.id}>
          <Text>
            {user.username} - {user.score}
          </Text>
        </View>
      ))}
      <Button onPress={onClose} title="Zavřít" />
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
