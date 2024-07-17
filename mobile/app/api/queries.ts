import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserSessionContext } from "../providers/UserSession";
import { Statue } from "../types/statues";
import { fetchAllStatues, fetchCollectedStatues } from "./statues";

export const useGetAllStatues = () => {
  const { session } = useContext(UserSessionContext);

  if (!session) {
    throw new Error("User session not found.");
  }

  return useQuery<Statue[], Error>({
    queryKey: ["statues"],
    queryFn: () => fetchAllStatues(session.access_token),
    initialData: [],
  });
};

export const useGetCollectedStatues = () => {
  const { session } = useContext(UserSessionContext);

  if (!session) {
    throw new Error("User session not found.");
  }

  return useQuery<number[], Error>({
    queryKey: ["collectedStatues"],
    queryFn: () => fetchCollectedStatues(session.access_token),
    initialData: [],
  });
};
