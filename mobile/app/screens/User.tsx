import "react-native-url-polyfill/auto";
import { useState, useEffect, useContext } from "react";
import { supabase } from "../utils/supabase";
import { Auth } from "../components/Auth";
import Account from "../components/Account";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { Button } from "react-native-elements";
import { UserSessionContext } from "../providers/UserSession";

export function User({ onClose }: { onClose: () => void }) {
  const { session } = useContext(UserSessionContext);

  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: "white",
        top: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
      <View style={{ padding: 12 }}>
        {session && <Button onPress={onClose} title="Zavřít" />}
      </View>
    </View>
  );
}
