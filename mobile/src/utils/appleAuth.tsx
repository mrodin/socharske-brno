import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "./supabase";
import { Alert } from "react-native";

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

      alert("User signed in " + user?.email); // TODO: just for testing

      // push notification with error once they are implemented
      if (!error) {
        // User is signed in.
        console.log("User signed in", user);
        alert("User error in " + JSON.stringify(error)); // TODO: just for testing
      }
    } else {
      throw new Error("No identityToken.");
    }
  } catch (e) {
    if (e.code === "ERR_REQUEST_CANCELED") {
      // handle that the user canceled the sign-in flow
      console.log("User canceled the sign-in flow");
    } else {
      // handle other errors
      console.error("Error during Apple sign-in", e);
      Alert.alert("Neco se pokazilo");
    }
  }
};
