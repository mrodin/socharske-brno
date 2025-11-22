import React, { FC } from "react";

import { Map } from "@/components/Map";
import { StatueDetail } from "@/components/StatueDetail";

const Home: FC = () => {
  return (
    <>
      <Map />
      <StatueDetail />
    </>
  );
};

export default Home;
