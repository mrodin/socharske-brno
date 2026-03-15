import { FC, useContext } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";

import { useGetFollowedProfiles, useGetLeaderboard } from "@/api/queries";
import { Player } from "@/components/leaderboard/Player";
import { Title } from "@/components/Title";
import { router } from "expo-router";
import { TopPlayer } from "@/components/leaderboard/TopPlayer";
import { useUserInfo } from "@/providers/UserInfo";
import { CurrentPlayer } from "@/components/leaderboard/CurrentPlayer";
import { Divider } from "react-native-elements";
import { SearchProfileButton } from "@/components/leaderboard/SearchProfileButton";

const LeaderBoard: FC = () => {
  const { data: leaderboard } = useGetLeaderboard();
  const { userInfo } = useUserInfo();
  const { data: followedProfiles } = useGetFollowedProfiles();

  const [firstUser, secondUser, thirdUser, ...restUsers] = leaderboard || [];

  const currentUserInLeaderboard = leaderboard?.find(
    (user) => user.id === userInfo?.id
  );

  const restOfLeaderboard = restUsers?.filter(
    (user) => user.id !== currentUserInLeaderboard?.id
  );

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-gray flex-1 gap-4 px-6 mt-3">
          <View className="flex flex-row mt-4 mb-2">
            <TopPlayer
              username={secondUser?.username}
              avatarUrl={secondUser?.avatar}
              score={secondUser?.score}
              rank={2}
              onPress={() => {
                router.navigate(`/leaderboard/profile?id=${secondUser?.id}`);
              }}
            />
            <TopPlayer
              username={firstUser?.username}
              avatarUrl={firstUser?.avatar}
              score={firstUser?.score}
              rank={1}
              onPress={() => {
                router.navigate(`/leaderboard/profile?id=${firstUser?.id}`);
              }}
            />
            <TopPlayer
              username={thirdUser?.username}
              avatarUrl={thirdUser?.avatar}
              score={thirdUser?.score}
              rank={3}
              onPress={() => {
                router.navigate(`/leaderboard/profile?id=${thirdUser?.id}`);
              }}
            />
          </View>
          {currentUserInLeaderboard && (
            <CurrentPlayer
              rank={currentUserInLeaderboard.rank}
              username={currentUserInLeaderboard.username}
              score={currentUserInLeaderboard.score}
              avatarUrl={currentUserInLeaderboard?.avatar}
            />
          )}

          {followedProfiles && followedProfiles.length > 0 && (
            <>
              <Title className="text-gray-pale text-base text-center tracking-wide">
                Sledovaní hráči
              </Title>
              <View className="gap-3">
                {leaderboard
                  ?.filter((user) => followedProfiles.includes(user.id))
                  .map((user) => (
                    <Player
                      onPress={() => {
                        router.navigate(`/leaderboard/profile?id=${user.id}`);
                      }}
                      key={user.id}
                      rank={user.rank}
                      name={user.username}
                      score={user.score.toFixed()}
                      avatarUrl={user.avatar}
                    />
                  ))}
              </View>
              <Divider />
            </>
          )}

          <View className="flex flex-row justify-center">
            <Title className="text-gray-pale text-base text-center tracking-wide">
              Další hráči
            </Title>
            <SearchProfileButton
              className="absolute right-0 top-0"
              onPress={function (): void {
                router.navigate("/leaderboard/search");
              }}
            />
          </View>

          <View className="flex flex-col gap-3">
            {restOfLeaderboard.map((user) => (
              <Player
                onPress={() => {
                  router.navigate(`/leaderboard/profile?id=${user.id}`);
                }}
                key={user.id}
                rank={user.rank}
                name={user.username}
                score={user.score.toFixed()}
                avatarUrl={user.avatar}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderBoard;
