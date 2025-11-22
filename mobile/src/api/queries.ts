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
    queryFn: () =>
      fetchWithAuth(
        "https://europe-west3-socharske-brno.cloudfunctions.net/statues_get_all",
        session.access_token,
        { method: "GET" }
      ),
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
    queryFn: () =>
      fetchWithAuth(
        "https://europe-west3-socharske-brno.cloudfunctions.net/get_collected_statues",
        session.access_token,
        { method: "GET" }
      ),
    initialData: [],
  });
};

export const useGetLeaderboard = () => {
  const session = useSession();

  return useQuery<LeaderBoardEntry[], Error>({
    queryKey: ["leaderboard"],
    queryFn: () =>
      fetchWithAuth(
        "https://europe-west3-socharske-brno.cloudfunctions.net/get_leaderboard",
        session.access_token,
        { method: "GET" }
      ),
    initialData: [],
  });
};

export const useCollectStatue = () => {
  const session = useSession();
  const leaderboard = useGetLeaderboard();
  const collectedStatues = useGetCollectedStatues();

  return useMutation({
    mutationFn: (statueId: number) =>
      fetchWithAuth(
        "https://europe-west3-socharske-brno.cloudfunctions.net/statue_collected",
        session.access_token,
        { method: "POST", body: { statue_id: statueId } }
      ),
    onSuccess: async () => {
      await leaderboard.refetch();
      await collectedStatues.refetch();
    },
  });
};
