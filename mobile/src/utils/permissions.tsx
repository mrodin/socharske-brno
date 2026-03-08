import { Alert, AppState, Linking } from "react-native";
import { IS_IOS } from "./platform";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const openAppSettings = () => {
  if (IS_IOS) {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};

export enum PermissionStatus {
  Granted = "granted",
  Denied = "denied",
  Pending = "pending",
}

export const useLocationPermission = () => {
  const [granted, setGranted] = useState<PermissionStatus>(
    PermissionStatus.Pending
  );

  useEffect(() => {
    let isActive = true;

    const refreshPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (isActive) {
        setGranted(
          status === "granted"
            ? PermissionStatus.Granted
            : PermissionStatus.Denied
        );
      }
    };

    refreshPermission(); // initial check

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        // when app comes to foreground, re-check permission
        refreshPermission();
      }
    });

    return () => {
      isActive = false;
      subscription.remove();
    };
  }, []);

  return granted;
};

export const locationPermissionAlert = () => {
  Alert.alert(
    "Zapni si určování polohy",
    "Aby ti fungovalo určování polohy, musíš mít povolené polohové služby v nastavení telefonu.",
    [
      {
        text: "Zavřít",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Nastavení", onPress: openAppSettings },
    ]
  );
};
