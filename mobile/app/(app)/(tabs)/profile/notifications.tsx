import { Alert, ScrollView, Switch, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "@/providers/UserInfo";
import { supabase } from "@/utils/supabase";
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
  const { userInfo } = useContext(UserInfoContext);
  const permissionStatus = useNotificationPermission();
  const [preferences, setPreferences] = useState<Record<NotificationType, boolean>>(
    () => Object.fromEntries(NOTIFICATION_TYPES.map((t) => [t, true])) as Record<NotificationType, boolean>
  );
  const [loadingPrefs, setLoadingPrefs] = useState(true);
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

  // Load user's saved preferences
  useEffect(() => {
    if (!userInfo?.id) return;
    const load = async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("notification_type, enabled")
        .eq("profile_id", userInfo.id);
      if (data) {
        const overrides: Partial<Record<NotificationType, boolean>> = {};
        for (const row of data) {
          overrides[row.notification_type as NotificationType] = row.enabled;
        }
        setPreferences((prev) => ({ ...prev, ...overrides }));
      }
      setLoadingPrefs(false);
    };
    load();
  }, [userInfo?.id]);

  const handleToggle = async (type: NotificationType, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [type]: value }));
    setSavingType(type);
    const { error } = await supabase.from("notification_preferences").upsert(
      {
        profile_id: userInfo!.id,
        notification_type: type,
        enabled: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,notification_type" }
    );
    if (error) {
      setPreferences((prev) => ({ ...prev, [type]: !value }));
      Alert.alert("Chyba", "Nepodařilo se uložit nastavení.");
    }
    setSavingType(null);
  };

  if (loadingPrefs) return null;

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
              value={preferences[type]}
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
