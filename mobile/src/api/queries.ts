import { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { UserSessionContext } from "../providers/UserSession";
import { CollectedStatue, Statue } from "../types/statues";
import { fetchWithAuth } from "../utils/api";

const useSession = () => {
  const { session } = useContext(UserSessionContext);

  if (!session) {
    throw new Error("User session not found.");
  }

  return session;
};

export const useGetAllStatues = () => {
  const session = useSession();

  return useQuery<Statue[], Error, Record<number, Statue>>({
    initialData: [],
    queryKey: ["statues"],
    queryFn: () => fetchWithAuth("statues-get-all", session.access_token),
    select: (data) =>
      data.reduce(
        (acc, statue) => {
          acc[statue.id] = statue;
          return acc;
        },
        {} as Record<number, Statue>
      ),
  });
};

export const useGetCollectedStatues = () => {
  const session = useSession();

  return useQuery<CollectedStatue[], Error>({
    queryKey: ["collectedStatues"],
    queryFn: () => fetchWithAuth("get-collected-statues", session.access_token),
    initialData: [],
  });
};

export const useGetLeaderboard = () => {
  const session = useSession();

  return useQuery<LeaderBoardEntry[], Error>({
    queryKey: ["leaderboard"],
    queryFn: () => fetchWithAuth("get-leaderboard", session.access_token),
    initialData: [],
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCollectStatue = () => {
  const session = useSession();
  const leaderboard = useGetLeaderboard();
  const collectedStatues = useGetCollectedStatues();

  return useMutation({
    mutationFn: (statueId: number) =>
      fetchWithAuth("statue-collected", session.access_token, {
        statue_id: statueId,
      }),

    onSuccess: async () => {
      await leaderboard.refetch();
      await collectedStatues.refetch();
    },
  });
};

type SendStatueFeedbackParams = {
  message: string;
  statueId: number;
};

export const useSendStatueFeedback = () => {
  const session = useSession();

  return useMutation<void, Error, SendStatueFeedbackParams>({
    mutationFn: ({ message, statueId }) =>
      fetchWithAuth("send-statue-feedback", session.access_token, {
        statue_id: statueId,
        message,
      }),
  });
};
