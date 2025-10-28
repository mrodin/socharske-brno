import React, { FC } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Map } from "@/components/Map";
import { StatueDetail } from "@/components/StatueDetail";

const Home: FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map />
      <StatueDetail />
    </GestureHandlerRootView>
  );
};

export default Home;
