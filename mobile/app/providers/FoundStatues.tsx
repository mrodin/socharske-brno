import { createContext } from "react";
import { useFoundStateuIds } from "../api/statues";

export const FoundStatuesContext = createContext<[number[], () => void]>([
  [],
  () => {},
]);

export function FoundStatuesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statueIds, refresh] = useFoundStateuIds();

  return (
    <FoundStatuesContext.Provider value={[statueIds, refresh]}>
      {children}
    </FoundStatuesContext.Provider>
  );
}
