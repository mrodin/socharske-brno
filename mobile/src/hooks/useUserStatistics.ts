import { useGetLeaderboard } from "@/api/queries";
import { UserInfoContext } from "@/providers/UserInfo";
import { useContext } from "react";

export const useUserStatistics = () => {
  const { userInfo } = useContext(UserInfoContext);

  const { data: leaderboard } = useGetLeaderboard();

  if (!userInfo) return null;

  const userIndex = leaderboard.findIndex((user) => user.id === userInfo.id);

  if (userIndex === -1) return null;

  const userScore = leaderboard[userIndex];

  return {
    rank: userIndex + 1,
    score: userScore.score,
  };
};
