import React, { FC, useContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Region } from "react-native-maps";

import { Map } from "@/components/Map";
import { StatueDetail } from "@/components/StatueDetail";
import { UserSessionContext } from "@/providers/UserSession";
import { Auth } from "@/screens/Auth";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { Statue } from "@/types/statues";
import { Redirect } from "expo-router";

const brnoRegion: Region = {
  latitude: 49.1759324,
  longitude: 16.5630407,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const Home: FC = () => {
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [loading, setLoading] = useState(true);
  const [orginRegion, setOrginRegion] = useState<any>(brnoRegion);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map
        initialRegion={orginRegion}
        onSelectStatue={(statue) => {
          setSelectedStatue(statue);
        }}
        selectedStatue={selectedStatue}
      />

      {selectedStatue && (
        <StatueDetail
          statue={selectedStatue}
          onClose={() => setSelectedStatue(null)}
        />
      )}
    </GestureHandlerRootView>
  );
};

export default Home;
