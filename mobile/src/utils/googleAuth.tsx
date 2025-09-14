import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "./supabase";
import { setUserId, track } from "@amplitude/analytics-react-native";

export const googleAuth = async () => {
  GoogleSignin.configure({
    scopes: [],
    iosClientId:
      "865962598053-cpic88pj6c8raaqlsca0qhua9mk1id7c.apps.googleusercontent.com",
  });
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    if (userInfo.idToken) {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.idToken,
      });

      if (!error) {
        setUserId(user?.id);
        track("Login Success", { method: "Google", userId: user?.id });
        // User is signed in.
        console.log("User signed in", user);
      } else {
        track("Login Failed", { method: "Google", error: error.message });
        console.error("Error during Google sign-in", error);
      }
    } else {
      track("Login Failed", {
        method: "Google",
        error: "no ID token present!",
      });
      throw new Error("no ID token present!");
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
      track("Login Failed", { method: "Google", error: error.message });
      console.error("Error during Google sign-in", error);
    }
  }
};
