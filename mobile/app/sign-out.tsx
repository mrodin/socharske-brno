import { useEffect } from "react";
import { View } from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";

const Signout = () => {
  const router = useRouter();
  // We want to need to sign out out of the (tabs) layout and auth layout.
  // Because after signing out, session is deleted and hooks not working

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.refreshSession();
      await supabase.auth.signOut();

      router.replace("/auth");
    };
    signOut();
  }, []);
  return <View className="bg-gray w-full h-full"></View>;
};

export default Signout;
