import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export const UserSessionContext = createContext<{
  session: Session | null;
  isAuthenticating: boolean;
  setSession: (session: Session | null) => void;
}>({
  session: null,
  isAuthenticating: true,
  setSession: () => {},
});

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.refreshSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticating(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <UserSessionContext.Provider
      value={{ isAuthenticating, session, setSession }}
    >
      {children}
    </UserSessionContext.Provider>
  );
}
