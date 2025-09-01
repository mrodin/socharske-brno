import React, { FC, useContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Map } from "@/components/Map";
import { StatueDetail } from "@/components/StatueDetail";
import { UserSessionContext } from "@/providers/UserSession";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { LoadingContext } from "@/providers/LoadingProvider";
import Wizard from "app/wizard";

const Home: FC = () => {
  const { loading } = useContext(LoadingContext);
  const { session } = useContext(UserSessionContext);

  if (loading || !session) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map />
      <StatueDetail />
      <Wizard />
    </GestureHandlerRootView>
  );
};

export default Home;
