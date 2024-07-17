import { Statue } from "../types/statues";

export const getAllStatues = async (token: string): Promise<Statue[]> => {
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
    throw new Error("Response to statues_get_all was not ok.");
  }

  return response.json();
};

export const getCollectedStatues = async (token: string): Promise<number[]> => {
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
    throw new Error("Response to get_collected_statues was not ok.");
  }

  return response.json();
};

export const getLeaderboard = async (
  token: string
): Promise<LeaderBoardEntry[]> => {
  const response = await fetch(
    "https://europe-west3-socharske-brno.cloudfunctions.net/get_leaderboard",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Response to get_leaderboard was not ok.");
  }

  return response.json();
};

export const collectStatue = async (
  token: string,
  statueId: number
): Promise<string> => {
  const response = await fetch(
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

  if (!response.ok) {
    throw new Error("Response to statue_collected was not ok.");
  }

  return response.json();
};
