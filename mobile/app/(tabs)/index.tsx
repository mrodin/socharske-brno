import React, { FC, useContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Map } from "@/components/Map";
import { StatueDetail } from "@/components/StatueDetail";
import { UserSessionContext } from "@/providers/UserSession";
import { Auth } from "@/screens/Auth";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { LoadingContext } from "@/providers/LoadingProvider";
import { SelectedStatueContext } from "@/providers/SelectedStatueProvider";

const Home: FC = () => {
  const { loading } = useContext(LoadingContext);
  const { session, isAuthentizating } = useContext(UserSessionContext);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthentizating && !session) {
    return <Auth />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map />
      <StatueDetail />
    </GestureHandlerRootView>
  );
};

export default Home;
