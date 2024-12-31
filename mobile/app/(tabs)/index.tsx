import { useRouter } from "expo-router";
import React, { FC, useContext, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Region } from "react-native-maps";

import { CollectionButton } from "@/components/CollectionButton";
import { Map } from "@/components/Map";
import { NavigationOpenButton } from "@/components/navigation/NavigationOpenButton";
import { StatueDetail } from "@/components/StatueDetail";
import { UserSessionContext } from "@/providers/UserSession";
import { Statue } from "@/types/statues";

const brnoRegion: Region = {
  latitude: 49.1759324,
  longitude: 16.5630407,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const Home: FC = () => {
  const router = useRouter();

  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [loading, setLoading] = useState(true);
  const { session, isAuthentizating } = useContext(UserSessionContext);
  const [orginRegion, setOrginRegion] = useState<any>(brnoRegion);

  if (!session) {
    return null;
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
      <View className="absolute top-[60px] w-full flex items-center">
        <CollectionButton onPress={() => router.push("/my-statues")} />
      </View>

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
