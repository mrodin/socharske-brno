import React, { FC } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Map } from "@/components/Map";
import { StatueDetail } from "@/components/StatueDetail";
import Wizard from "@/components/wizard";

const Home: FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map />
      <StatueDetail />
      <Wizard />
    </GestureHandlerRootView>
  );
};

export default Home;
