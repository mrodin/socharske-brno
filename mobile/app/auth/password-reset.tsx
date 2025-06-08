import React, { useContext, useEffect } from "react";
import { Alert, View } from "react-native";

import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/utils/supabase";
import { UserSessionContext } from "@/providers/UserSession";

const parseSupabaseUrl = (url: string) => {
  // by https://blog.theodo.com/2023/03/supabase-reset-password-rn/
  let parsedUrl = url;
  if (url.includes("#")) {
    parsedUrl = url.replace("#", "?");
  }

  return parsedUrl;
};

const PasswordReset = () => {
  const router = useRouter();
  const { setSession } = useContext(UserSessionContext);

  useEffect(() => {
    const call = async () => {
      const url = Linking.getLinkingURL();
      if (!url) {
        return;
      }
      const transformedUrl = parseSupabaseUrl(url);
      const queryParams = Linking.parse(transformedUrl).queryParams as {
        error_description: string;
        access_token?: string;
        refresh_token?: string;
      };

      console.log(queryParams); // Keep for debugging

      if (queryParams.error_description) {
        Alert.alert("Něco se pokazilo: " + queryParams.error_description);
        router.navigate("/auth");
      } else {
        const access_token = queryParams?.access_token;
        const refresh_token = queryParams?.refresh_token;
        if (
          typeof access_token === "string" &&
          typeof refresh_token === "string"
        ) {
          // Set the user session
          await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          //
          await supabase.auth.refreshSession();
          const newSession = await supabase.auth.getSession();
          setSession(newSession.data.session);

          Alert.alert("Jste přihlášen, nyní můžete změnit heslo");
          // Redirect to the profile page to change the password
        } else {
          console.log('"Invalid tokens", queryParams);');
          Alert.alert("Něco se pokazilo");
          router.navigate("/auth");
        }
      }
    };

    call().catch((err) => {
      // Handle other errors
      console.log("Unknown error", err);
      Alert.alert("Něco se pokazilo");
      router.navigate("/auth");
    });
  }, []);

  return <View className="bg-gray h-full w-full"></View>;
};

export default PasswordReset;
