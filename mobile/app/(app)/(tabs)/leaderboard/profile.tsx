import { FC } from "react";
import { View, SafeAreaView, ScrollView, Text } from "react-native";

import {
  useGetFollowedProfiles,
  useGetLeaderboard,
  useToggleProfileFollow,
} from "@/api/queries";
import { ProfileDetail } from "@/components/ProfileDetail";
import { useLocalSearchParams } from "expo-router";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { useUserInfo } from "@/providers/UserInfo";

const LeaderBoard: FC = () => {
  const { userInfo } = useUserInfo();
  const { data: leaderboard } = useGetLeaderboard();
  const { mutate: toggleFollow } = useToggleProfileFollow();
  const { data: followedProfiles } = useGetFollowedProfiles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserIndex = leaderboard.findIndex((user) => user.id === id);

  if (currentUserIndex === -1) {
    // It can happen that the user was removed from the leaderboard
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Hráč nenalezen</Text>
      </View>
    );
  }

  const currentUser = leaderboard[currentUserIndex];

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-5">
          <ProfileDetail
            username={currentUser.username}
            action={
              userInfo?.id !== id && (
                <FollowProfileButton
                  isFollowing={followedProfiles?.some(
                    (profileId) => profileId === id
                  )}
                  onPress={() => toggleFollow(id)}
                />
              )
            }
            score={currentUser.score}
            rank={currentUserIndex + 1}
            avatarUrl={currentUser.avatar}
            collectedStatuesCount={currentUser.collectedStatuesCount}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderBoard;
