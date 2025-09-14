import React, { FC, useContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Map } from "@/components/Map";
import { StatueDetail } from "@/components/StatueDetail";
import { UserSessionContext } from "@/providers/UserSession";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { LoadingContext } from "@/providers/LoadingProvider";
import Wizard from "@/components/wizard";
import { track } from "@amplitude/analytics-react-native";

const Home: FC = () => {
  const { loading } = useContext(LoadingContext);
  const { session } = useContext(UserSessionContext);

  useEffect(() => {
    track("Page View", { page: "Home" });
  }, []);

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
