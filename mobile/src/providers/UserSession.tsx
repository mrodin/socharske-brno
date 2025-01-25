import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export const UserSessionContext = createContext<{
  session: Session | null;
  isAuthentizating: boolean;
  setSession: (session: Session | null) => void;
}>({
  session: null,
  isAuthentizating: true,
  setSession: () => {},
});

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [isAuthentizating, setIsAuthentizating] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthentizating(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <UserSessionContext.Provider
      value={{ isAuthentizating, session, setSession }}
    >
      {children}
    </UserSessionContext.Provider>
  );
}
