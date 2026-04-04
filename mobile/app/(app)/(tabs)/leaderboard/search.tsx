import { FC, useState } from "react";
import { View, SafeAreaView, ScrollView, Text } from "react-native";

import {
  useGetFollowedProfiles,
  useGetLeaderboard,
  useToggleProfileFollow,
} from "@/api/queries";
import { router, useLocalSearchParams } from "expo-router";
import { useUserInfo } from "@/providers/UserInfo";
import Search from "../search";
import { SearchBar } from "react-native-elements";
import { Player } from "@/components/leaderboard/Player";
import { SearchProfileBar } from "@/components/leaderboard/SearchProfileBar";
import { SearchedPlayer } from "@/components/leaderboard/SearchedPlayer";

const LeaderBoard: FC = () => {
  const [searchText, setSearchText] = useState("");
  const { userInfo } = useUserInfo();
  const { data: leaderboard, isLoading } = useGetLeaderboard();
  const { mutate: toggleFollow } = useToggleProfileFollow();
  const { data: followedProfiles } = useGetFollowedProfiles();
  const { id } = useLocalSearchParams<{ id: string }>();

  const matches =
    searchText.length > 0
      ? leaderboard.filter((user) =>
          user.username.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

  const updateSearchText = (text: string) => {
    setSearchText(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <SearchProfileBar
        searchText={searchText}
        updateSearchText={updateSearchText}
        isLoading={isLoading}
      />
      <ScrollView
        className="flex-1 flex flex-col size-full"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {matches.length > 0 ? (
          matches.map((user) => (
            <SearchedPlayer
              key={user.id}
              name={user.username}
              avatarUrl={user.avatar}
              isFollowing={
                followedProfiles?.some((profileId) => profileId === user.id) ||
                false
              }
              onProfilePress={() => {
                router.navigate(`/leaderboard/profile?id=${user.id}`);
              }}
              onToggleFollowPress={() => toggleFollow(user.id)}
            />
          ))
        ) : (
          <View className="flex-1 flex flex-col gap-4 w-full px-5 justify-center items-center">
            <Text className="text-gray-light">Žádné výsledky</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderBoard;
