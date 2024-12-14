import React, { useContext, useEffect, useState } from "react";
import { View } from "../components/View";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CollectionButton } from "../components/CollectionButton";
import { DrawerNavigation } from "../components/navigation/DrawerNavigation";
import { Map } from "../components/Map";
import { NavigationOpenButton } from "../components/navigation/NavigationOpenButton";
import { StatueDetail } from "../components/StatueDetail";
import { UserSessionContext } from "../providers/UserSession";
import { Statue } from "../types/statues";
import { LeaderBoard } from "./LeaderBoard";
import { MyStatues } from "./MyStatues";
import { Region } from "react-native-maps";
import { LoadingScreen } from "./LoadingScreen";
import { Auth } from "../components/Auth";

type Routes =
  | "myStatues"
  | "leaderBoard"
  | "trophies"
  | "trails"
  | "photos"
  | "layers"
  | "settings"
  | "map";

const brnoRegion: Region = {
  latitude: 49.1759324,
  longitude: 16.5630407,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const Main = () => {
  const [route, setRoute] = useState<Routes>("settings");
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session, isAuthentizating } = useContext(UserSessionContext);
  const [orginRegion, setOrginRegion] = useState<any>(brnoRegion);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (session) {
      setRoute("map");
    }
  }, [session === null, setRoute]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthentizating && !session) {
    return <Auth />;
  }

  if (route === "settings") {
    return <Account onClickBack={() => setRoute("map")} />;
  }

  if (route === "myStatues") {
    return <MyStatues onClose={() => setRoute("map")} />;
  }

  if (route === "leaderBoard") {
    return <LeaderBoard onClose={() => setRoute("map")} />;
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Map
          initialRegion={orginRegion}
          onSelectStatue={(statue) => {
            setSelectedStatue(statue);
          }}
          selectedStatue={selectedStatue}
        />
        <View className="absolute top-[60px] w-full flex items-center">
          <CollectionButton onPress={() => setRoute("myStatues")} />
        </View>
        <NavigationOpenButton onPress={() => setShowLeftDrawer(true)} />

        {selectedStatue && (
          <StatueDetail
            statue={selectedStatue}
            onClose={() => setSelectedStatue(null)}
          />
        )}
        {showLeftDrawer && (
          <DrawerNavigation
            setOriginRegion={setOrginRegion}
            onClose={() => setShowLeftDrawer(false)}
            onSelect={(route) => {
              setRoute(route as Routes);
              setShowLeftDrawer(false);
            }}
          />
        )}
      </GestureHandlerRootView>
    </>
  );
};
