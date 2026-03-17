import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { supabase } from "../utils/supabase";

const PROJECT_ID = Constants.expoConfig?.extra?.eas?.projectId as string;

async function savePushToken(userId: string): Promise<void> {
  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: PROJECT_ID,
    });
    await supabase
      .from("profiles")
      .update({ expo_push_token: token })
      .eq("id", userId);
  } catch (error) {
    console.error("Failed to save push token:", error);
  }
}

async function saveIfGranted(userId: string): Promise<void> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") {
    await savePushToken(userId);
  }
}

export function usePushNotifications(userId: string | null) {
  const listenerRef = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (!userId || !Device.isDevice) return;

    // Silently refresh token on every app start if permission already granted
    saveIfGranted(userId);

    // Re-check when app comes to foreground (e.g. user enabled notifications in phone settings)
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        saveIfGranted(userId);
      }
    });

    // Handle token rotation (rare but possible)
    listenerRef.current = Notifications.addPushTokenListener(() => {
      savePushToken(userId);
    });

    return () => {
      appStateSubscription.remove();
      listenerRef.current?.remove();
    };
  }, [userId]);

  async function requestPermission(): Promise<boolean> {
    if (!userId || !Device.isDevice) return false;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return false;

    await savePushToken(userId);
    return true;
  }

  return { requestPermission };
}
