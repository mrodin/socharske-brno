import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { LoadingScreen } from "@/screens/LoadingScreen";

export const UserSessionContext = createContext<{
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
}>({
  session: null,
  loading: true,
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
      value={{ loading: isAuthenticating, session, setSession }}
    >
      {children}
    </UserSessionContext.Provider>
  );
}
