import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { UserSessionContext } from "./UserSession";
import { Alert } from "react-native";

type UserInfo = {
  username: string;
  avatarUrl: string;
  email: string;
  provider?: string;
  id: string;
  devMode: boolean;
};

export const UserInfoContext = createContext<{
  userInfo: UserInfo | null;
  loading: boolean;
  updateProfile: (data: {
    username?: string;
    avatar_url?: string;
  }) => Promise<void>;
}>({
  userInfo: null,
  loading: true,
  updateProfile: async () => {},
});

/**
 * Provider for the user info of the currently signed-in user.
 */
export function UserInfoProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { session } = useContext(UserSessionContext);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url, dev_mode`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserInfo({
          username: data.username,
          avatarUrl: data.avatar_url,
          email: session?.user?.email || "",
          devMode: data.dev_mode,
          provider: session.user.app_metadata.provider,
          id: session.user.id,
        });

        if (session?.user.user_metadata?.avatar_url && !data.avatar_url) {
          // set provider avatar_url if not set
          await updateProfile({
            avatar_url: session?.user.user_metadata.avatar_url,
          });
        }
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
      });
      setLoading(false);
    }
  }

  return (
    <UserInfoContext.Provider value={{ userInfo, loading, updateProfile }}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { session } = useContext(UserSessionContext);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserInfo({
          username: data.username,
          avatarUrl: data.avatar_url,
          email: session?.user?.email || "",
          provider: session.user.app_metadata.provider,
          id: session.user.id,
        });

        if (session?.user.user_metadata?.avatar_url && !data.avatar_url) {
          // set provider avatar_url if not set
          await updateProfile({
            avatar_url: session?.user.user_metadata.avatar_url,
          });
        }
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
      });
      setLoading(false);
    }
  }

  return { userInfo, loading, updateProfile };
}

export function useUserInfo() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { session } = useContext(UserSessionContext);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserInfo({
          username: data.username,
          avatarUrl: data.avatar_url,
          email: session?.user?.email || "",
          provider: session.user.app_metadata.provider,
          id: session.user.id,
        });

        if (session?.user.user_metadata?.avatar_url && !data.avatar_url) {
          // set provider avatar_url if not set
          await updateProfile({
            avatar_url: session?.user.user_metadata.avatar_url,
          });
        }
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
      });
      setLoading(false);
    }
  }

  return { userInfo, loading, updateProfile };
}

export function useUserInfo() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { session } = useContext(UserSessionContext);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserInfo({
          username: data.username,
          avatarUrl: data.avatar_url,
          email: session?.user?.email || "",
          provider: session.user.app_metadata.provider,
          id: session.user.id,
        });

        if (session?.user.user_metadata?.avatar_url && !data.avatar_url) {
          // set provider avatar_url if not set
          await updateProfile({
            avatar_url: session?.user.user_metadata.avatar_url,
          });
        }
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
      });
      setLoading(false);
    }
  }

  return { userInfo, loading, updateProfile };
}

export function useUserInfo() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { session } = useContext(UserSessionContext);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserInfo({
          username: data.username,
          avatarUrl: data.avatar_url,
          email: session?.user?.email || "",
          provider: session.user.app_metadata.provider,
          id: session.user.id,
        });

        if (session?.user.user_metadata?.avatar_url && !data.avatar_url) {
          // set provider avatar_url if not set
          await updateProfile({
            avatar_url: session?.user.user_metadata.avatar_url,
          });
        }
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
      });
      setLoading(false);
    }
  }

  return { userInfo, loading, updateProfile };
}

export function useUserInfo() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { session } = useContext(UserSessionContext);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserInfo({
          username: data.username,
          avatarUrl: data.avatar_url,
          email: session?.user?.email || "",
          provider: session.user.app_metadata.provider,
          id: session.user.id,
        });

        if (session?.user.user_metadata?.avatar_url && !data.avatar_url) {
          // set provider avatar_url if not set
          await updateProfile({
            avatar_url: session?.user.user_metadata.avatar_url,
          });
        }
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
      });
      setLoading(false);
    }
  }

  return { userInfo, loading, updateProfile };
}
