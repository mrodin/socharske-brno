import React from "react";
import { Statue } from "../types/statues";
import statues from "../data/statues.json";

export const useStatues = () => {
  const [statueItems, setStatueItems] = React.useState<Statue[]>(statues);

  // React.useEffect(() => {
  //   fetch("https://statues-get-all-5x4zcivk7a-ey.a.run.app")
  //     .then((response) => response.json())
  //     .then((data) => setStatueItems(data));
  // }, []);

  return statueItems;
};
