import { createContext, useContext, useEffect, useState } from "react";
import { UserInfoContext } from "./UserInfo";

export const UserAvatarContext = createContext<{
  url: string | null;
}>({
  url: null,
});

/**
 * Provider for the avatar of the currently signed-in user.
 */
export function UserAvatarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo } = useContext(UserInfoContext);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo?.avatarUrl) {
      setUrl(userInfo?.avatarUrl);
    }
  }, [userInfo]);

  return (
    <UserAvatarContext.Provider value={{ url }}>
      {children}
    </UserAvatarContext.Provider>
  );
}
