import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { UserSessionContext } from "./UserSession";
import { UserInfoContext } from "./UserInfo";

export const UserAvatarContext = createContext<{
  url: string | null;
  loading: boolean;
}>({
  url: null,
  loading: true,
});

/**
 * Provider for the avatar of the currently signed-in user.
 */
export function UserAvatarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(UserInfoContext);
  const { session } = useContext(UserSessionContext);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (userInfo) {
      if (userInfo.avatarUrl) {
        // set the avatar url from the userInfo (uploaded by user)
        downloadImage(userInfo.avatarUrl);
      } else if (session?.user?.user_metadata.avatar_url) {
        // ser the avatar url from the user metadata (google profile picture, ...)
        setUrl(session.user.user_metadata.avatar_url);
        setLoading(true);
      }
    }
  }, [userInfo, session]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setUrl(fr.result as string);
        setLoading(false);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
      setLoading(false);
    }
  }

  return (
    <UserAvatarContext.Provider value={{ url, loading }}>
      {children}
    </UserAvatarContext.Provider>
  );
}
