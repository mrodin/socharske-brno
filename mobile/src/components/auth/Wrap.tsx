import React, { FC, ReactNode } from "react";
import { AppState, ScrollView, Text, View } from "react-native";
import { supabase } from "@/utils/supabase";
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type AuthWrap = {
  children: ReactNode;
  showSubtitle?: boolean;
};

const Wrap: FC<AuthWrap> = ({ children, showSubtitle }) => {
  return (
    <View className="h-full px-5 bg-gray w-full flex align-center">
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View className="gap-4 justify-self-center flex items-center mb-16">
          <Text className="text-white text-[35px] text-center w-full font-krona">
            LOVCI SOCH
          </Text>
          {showSubtitle && (
            <Text className="text-white text-xl text-center w-[250px]">
              Vydej se na dobrodružství a ulov si brněnské sochy
            </Text>
          )}
        </View>
        {children}
      </ScrollView>
    </View>
  );
};

export default Wrap;
