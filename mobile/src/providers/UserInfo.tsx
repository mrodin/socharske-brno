import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { UserSessionContext } from "./UserSession";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { Alert } from "react-native";
import {
  NOTIFICATION_TYPES,
  type NotificationType,
} from "@/constants/notificationTypes";

type PushNotificationPrefs = Record<NotificationType, boolean>;

type UserInfo = {
  username: string;
  avatarUrl: string;
  email: string;
  provider?: string;
  id: string;
  devMode: boolean;
  notificationPrefs: PushNotificationPrefs;
};

export const UserInfoContext = createContext<{
  userInfo: UserInfo | null;
  loading: boolean;
  updateProfile: (data: {
    username?: string;
    avatar_url?: string;
  }) => Promise<void>;
  requestPushPermission: () => Promise<boolean>;
  updateNotificationPref: (
    type: NotificationType,
    enabled: boolean
  ) => Promise<boolean>;
}>({
  userInfo: null,
  loading: true,
  updateProfile: async () => {},
  requestPushPermission: async () => false,
  updateNotificationPref: async () => false,
});

/**
 * Provider for the user info of the currently signed-in user.
 */
export function UserInfoProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { session } = useContext(UserSessionContext);
  const { requestPermission } = usePushNotifications(session?.user.id ?? null);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, dev_mode, push_notification_prefs(notification_type, enabled)`
        )
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        const notificationPrefs = Object.fromEntries(
          NOTIFICATION_TYPES.map((t) => [t, true])
        ) as PushNotificationPrefs;
        for (const pref of data.push_notification_prefs ?? []) {
          notificationPrefs[pref.notification_type as NotificationType] =
            pref.enabled;
        }

        setUserInfo({
          username: data.username,
          avatarUrl: data.avatar_url,
          email: session?.user?.email || "",
          devMode: data.dev_mode,
          provider: session.user.app_metadata.provider,
          id: session.user.id,
          notificationPrefs,
        });

        if (session?.user.user_metadata?.avatar_url && !data.avatar_url) {
          // set provider avatar_url if not set
          await updateProfile({
            avatar_url: session?.user.user_metadata.avatar_url,
          });
        }
      } else {
        // No profile data found, sign out the user (probably deleted)
        supabase.auth.signOut();
        supabase.auth.refreshSession();
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username?: string;
    avatar_url?: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username: username ?? userInfo?.username,
        avatar_url: avatar_url ?? userInfo?.avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      console.log("Error", error);
    } finally {
      setUserInfo({
        ...userInfo,
        email: userInfo?.email || "",
        username: username ?? userInfo?.username ?? "",
        avatarUrl: avatar_url ?? userInfo?.avatarUrl ?? "",
        id: userInfo?.id || "",
        devMode: userInfo?.devMode || false,
        notificationPrefs:
          userInfo?.notificationPrefs || ({} as PushNotificationPrefs),
      });
      setLoading(false);
    }
  }

  async function updateNotificationPref(
    type: NotificationType,
    enabled: boolean
  ): Promise<boolean> {
    if (!session?.user || !userInfo) return false;

    const previousPrefs = userInfo.notificationPrefs;

    setUserInfo({
      ...userInfo,
      notificationPrefs: { ...userInfo.notificationPrefs, [type]: enabled },
    });

    const { error } = await supabase.from("push_notification_prefs").upsert(
      {
        profile_id: session.user.id,
        notification_type: type,
        enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,notification_type" }
    );

    if (error) {
      setUserInfo({ ...userInfo, notificationPrefs: previousPrefs });
      return false;
    }

    return true;
  }

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        loading,
        updateProfile,
        requestPushPermission: requestPermission,
        updateNotificationPref,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
