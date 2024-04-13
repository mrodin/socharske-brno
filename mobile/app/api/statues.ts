import React from "react";
import { StatueItem } from "../types/statues";
import statues from "../data/statues.json";

export const useStatues = () => {
  const [statueItems, setStatueItems] = React.useState<StatueItem[]>(statues);

  // React.useEffect(() => {
  //   fetch("https://statues-get-all-5x4zcivk7a-ey.a.run.app")
  //     .then((response) => response.json())
  //     .then((data) => setStatueItems(data));
  // }, []);

  return statueItems;
};
