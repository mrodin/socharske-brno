import React, { useCallback, useContext, useEffect } from "react";
import { Statue } from "../types/statues";
import statues from "../data/statues.json";
import { UserSessionContext } from "../providers/UserSession";

export const fetchAllStatues = async (token: string): Promise<Statue[]> => {
  const response = await fetch(
    "https://europe-west3-socharske-brno.cloudfunctions.net/statues_get_all",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const fetchCollectedStatues = async (
  token: string
): Promise<number[]> => {
  const response = await fetch(
    "https://europe-west3-socharske-brno.cloudfunctions.net/get_collected_statues",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const useCollectStatue = () => {
  const { session } = useContext(UserSessionContext);

  const collect = useCallback(
    (statueId: number) => {
      if (!session) return;
      const token = session.access_token;
      return fetch(
        "https://europe-west3-socharske-brno.cloudfunctions.net/statue_collected",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statue_id: statueId }),
        }
      );
    },
    [session]
  );
  return collect;
};

export const useFoundStateuIds = (): [number[], () => void] => {
  const [foundStatues, setFoundStatues] = React.useState<number[]>([]);
  const { session } = useContext(UserSessionContext);

  const fetchFoundStatues = useCallback(async () => {
    if (!session) return;
    const token = session.access_token;
    return fetch(
      "https://europe-west3-socharske-brno.cloudfunctions.net/get_collected_statues",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setFoundStatues(data));
  }, [session]);

  useEffect(() => {
    fetchFoundStatues();
  }, [session]);

  useEffect(() => {
    console.log("refrewsh update", Date.now());
  }, [fetchFoundStatues]);

  return [foundStatues, fetchFoundStatues];
};

export const useLeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = React.useState<LeaderBoardEntry[]>([]);
  const fetchLeaderBoard = useCallback(() => {
    return fetch(
      "https://europe-west3-socharske-brno.cloudfunctions.net/get_leaderboard"
    )
      .then((response) => response.json())
      .then((data) => setLeaderBoard(data));
  }, []);

  useEffect(() => {
    fetchLeaderBoard();
  }, [fetchLeaderBoard]);

  return leaderBoard;
};
