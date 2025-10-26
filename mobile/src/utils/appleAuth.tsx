import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "./supabase";
import { Alert } from "react-native";
import { setUserId, track } from "@amplitude/analytics-react-native";

export const appleAuth = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    // Sign in via Supabase Auth.
    if (credential.identityToken) {
      const {
        error,
        data: { user },
      } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });

      // push notification with error once they are implemented
      if (!error) {
        setUserId(user?.id);
        track("Login Success", { method: "Apple", userId: user?.id });
        // User is signed in.
        console.log("User signed in", user?.email);
      } else {
        track("Login Failed", { method: "Apple", error: error.message });
        console.error("Error during Apple sign-in", error);
      }
    } else {
      track("Login Failed", { method: "Apple", error: "No identityToken." });
      throw new Error("No identityToken.");
    }
  } catch (e) {
    const error = e as Error;
    if ("code" in error && error.code === "ERR_REQUEST_CANCELED") {
      // handle that the user canceled the sign-in flow
      track("Login Canceled", { method: "Apple" });
      console.log("User canceled the sign-in flow");
    } else {
      // handle other errors
      track("Login Failed", { method: "Apple", error: e });
      console.error("Error during Apple sign-in", e);
      Alert.alert("Neco se pokazilo");
    }
  }
};
