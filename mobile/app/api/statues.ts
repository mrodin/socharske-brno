import React, { useCallback, useContext } from "react";
import { Statue } from "../types/statues";
import statues from "../data/statues.json";
import { Session } from "@supabase/supabase-js";
import { UserSessionContext } from "../providers/UserSession";

export const useStatues = () => {
  const [statueItems, setStatueItems] = React.useState<Statue[]>(statues);

  // React.useEffect(() => {
  //   fetch("https://statues-get-all-5x4zcivk7a-ey.a.run.app")
  //     .then((response) => response.json())
  //     .then((data) => setStatueItems(data));
  // }, []);

  return statueItems;
};

export const useFoundStateuIds = () => {
  const [foundStatues, setFoundStatues] = React.useState<number[]>([]);
  const { session } = useContext(UserSessionContext);

  const fetchFoundStatues = useCallback(() => {
    if (!session) return;
    const token = session.access_token;
    return fetch("https://statues-get-all-5x4zcivk7a-ey.a.run.app", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFoundStatues(data));
  }, [session]);

  React.useEffect(() => {
    fetchFoundStatues();
  }, []);

  const refresh = useCallback(() => {
    fetchFoundStatues();
  }, [fetchFoundStatues]);

  return [foundStatues, refresh];
};
