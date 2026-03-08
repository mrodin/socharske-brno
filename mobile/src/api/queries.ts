import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { UserSessionContext } from "../providers/UserSession";
import { Statue } from "../types/statues";
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

  return useQuery<Statue[], Error>({
    queryKey: ["statues"],
    queryFn: () =>
      fetchWithAuth(
        "https://europe-west3-socharske-brno.cloudfunctions.net/statues_get_all",
        session.access_token,
        { method: "GET" }
      ),
    initialData: [],
  });
};

export const useGetCollectedStatues = () => {
  const session = useSession();

  return useQuery<number[], Error>({
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

export const useGetLeaderboard = (): { data: LeaderBoardEntry[] } => {
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
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: (statueId: number) =>
      fetchWithAuth(
        "https://europe-west3-socharske-brno.cloudfunctions.net/statue_collected",
        session.access_token,
        { method: "POST", body: { statue_id: statueId } }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["statues", "collectedStatues", "leaderboard"],
      });
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

export const useToggleProfileFollow = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation<void, Error, string>({
    mutationFn: (followingId: string) =>
      fetchWithAuth("toggle-profile-follow", session.access_token, {
        following_id: followingId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followedProfiles"] });
    },
  });
};

export const useGetFollowedProfiles = () => {
  const session = useSession();

  return useQuery<string[], Error>({
    queryKey: ["followedProfiles"],
    queryFn: () => fetchWithAuth("get-followed-profiles", session.access_token),
    initialData: [],
  });
};
