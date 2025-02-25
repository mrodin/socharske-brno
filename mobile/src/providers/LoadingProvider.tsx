import { createContext, ReactNode, useEffect, useState } from "react";

export const LoadingContext = createContext<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
}>({
  loading: true,
  setLoading: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
