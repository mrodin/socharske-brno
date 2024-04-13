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
  const { session, setSession } = useContext(UserSessionContext);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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
      <Button onPress={onClose} title="Zavřít" />
    </View>
  );
}
