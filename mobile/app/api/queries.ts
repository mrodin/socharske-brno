import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { UserSessionContext } from "../providers/UserSession";
import { Statue } from "../types/statues";
import {
  collectStatue,
  getAllStatues,
  getCollectedStatues,
  getLeaderboard,
} from "./statues";

const useSession = () => {
  const { session } = useContext(UserSessionContext);

  if (!session) {
    throw new Error("User session not found.");
  }

  return session;
};

export const useGetAllStatues = () => {
  const session = useSession();

  return useQuery<Statue[], Error>({
    queryKey: ["statues"],
    queryFn: () => getAllStatues(session.access_token),
    initialData: [],
  });
};

export const useGetCollectedStatues = () => {
  const session = useSession();

  return useQuery<number[], Error>({
    queryKey: ["collectedStatues"],
    queryFn: () => getCollectedStatues(session.access_token),
    initialData: [],
  });
};

export const useGetLeaderboard = () => {
  const session = useSession();

  return useQuery<LeaderBoardEntry[], Error>({
    queryKey: ["leaderboard"],
    queryFn: () => getLeaderboard(session.access_token),
    initialData: [],
  });
};

export const useCollectStatue = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: (statueId: number) =>
      collectStatue(session.access_token, statueId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["statues", "collectedStatues", "leaderboard"],
      });
    },
  });
};
