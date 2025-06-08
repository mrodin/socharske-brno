import { useEffect } from "react"
import { View } from "react-native"
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";


const Signout = () => {
  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.refreshSession();
      await supabase.auth.signOut();
      router.replace("/auth");
    };
    signOut();
  }, [])
  return (
    <View className="bg-gray w-full h-full"></View>
  )
}

export default Signout;