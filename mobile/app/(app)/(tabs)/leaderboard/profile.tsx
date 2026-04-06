import { FC } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetLeaderboard, useGetProfileFollowData } from "@/api/queries";
import { ProfileDetail } from "@/components/ProfileDetail";
import { useLocalSearchParams } from "expo-router";

const LeaderBoard: FC = () => {
  const { data: leaderboard } = useGetLeaderboard();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profileFollowData } = useGetProfileFollowData(id);
  const currentUserIndex = leaderboard.findIndex((user) => user.id === id);

  const currentUser = leaderboard.at(currentUserIndex);

  if (currentUserIndex === -1 || !currentUser) {
    // It can happen that the user was removed from the leaderboard
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Hráč nenalezen</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-5">
          <ProfileDetail
            username={currentUser.username}
            score={currentUser.score}
            rank={currentUserIndex + 1}
            avatarUrl={currentUser.avatar}
            followersCount={profileFollowData.followersCount}
            followingCount={profileFollowData.followingCount}
            collectedStatuesCount={currentUser.collectedStatuesCount}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderBoard;
