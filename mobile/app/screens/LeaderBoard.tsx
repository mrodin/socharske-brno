import { View, Text, SafeAreaView } from "react-native";
import { Button } from "react-native-elements";
import { useLeaderBoard } from "../api/statues";

export function LeaderBoard({ onClose }: { onClose: () => void }) {
  const users = useLeaderBoard();
  return (
    <SafeAreaView>
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
