import { useEffect } from "react";
import { View } from "react-native";
import { supabase } from "@/utils/supabase";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { track } from "@amplitude/analytics-react-native";

const Signout = () => {
  const navigation = useNavigation();
  // We want to need to sign out out of the (tabs) layout and auth layout.
  // Because after signing out, session is deleted and hooks not working

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.refreshSession();
      await supabase.auth.signOut();

      track("Logout Success");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "auth" }],
        })
      );
    };
    signOut();
  }, []);
  return <View className="bg-gray w-full h-full"></View>;
};

export default Signout;
