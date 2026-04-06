import { Alert, ScrollView, Switch, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "@/providers/UserInfo";
import {
  openAppSettings,
  PermissionStatus,
  useNotificationPermission,
} from "@/utils/permissions";
import { theme } from "@/utils/theme";
import {
  NOTIFICATION_TYPES,
  type NotificationType,
} from "@/constants/notificationTypes";

const NOTIFICATION_OPTIONS: {
  type: NotificationType;
  label: string;
  description: string;
}[] = [
  {
    type: "inactive-users",
    label: "Týdenní připomínka",
    description: "Připomene ti hru, když ji 7 dní nehraješ.",
  },
];

const Notifications = () => {
  const { userInfo, updateNotificationPref } = useContext(UserInfoContext);
  const permissionStatus = useNotificationPermission();
  const [savingType, setSavingType] = useState<NotificationType | null>(null);

  // Show alert when iOS notifications are off or never asked
  useEffect(() => {
    if (
      permissionStatus === PermissionStatus.Denied ||
      permissionStatus === PermissionStatus.Undetermined
    ) {
      Alert.alert(
        "Upozornění jsou vypnutá",
        "Aby ti mohla aplikace posílat upozornění, musíš je nejdříve povolit v nastavení telefonu.",
        [
          { text: "Zavřít", style: "cancel" },
          { text: "Nastavení", onPress: openAppSettings },
        ]
      );
    }
  }, [permissionStatus]);

  const handleToggle = async (type: NotificationType, value: boolean) => {
    setSavingType(type);
    const success = await updateNotificationPref(type, value);
    if (!success) Alert.alert("Chyba", "Nepodařilo se uložit nastavení.");
    setSavingType(null);
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View className="p-5 gap-4">
        {NOTIFICATION_OPTIONS.map(({ type, label, description }) => (
          <View
            key={type}
            className="flex-row justify-between items-center py-3"
          >
            <View className="flex-1 pr-4">
              <Text className="text-white">{label}</Text>
              <Text className="text-sm" style={{ color: theme.greyLight }}>
                {description}
              </Text>
            </View>
            <Switch
              value={userInfo!.notificationPrefs[type]}
              onValueChange={(val) => handleToggle(type, val)}
              disabled={savingType === type}
              trackColor={{ true: theme.red }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Notifications;
