import { createContext, ReactNode, useState } from "react";
import { Statue } from "@/types/statues";

export const SelectedStatueContext = createContext<{
  selectedStatue: Statue | null;
  setSelectedStatue: (statue: Statue | null) => void;
}>({
  selectedStatue: null,
  setSelectedStatue: () => {},
});

export function SelectedStatueProvider({ children }: { children: ReactNode }) {
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);

  return (
    <SelectedStatueContext.Provider
      value={{ selectedStatue, setSelectedStatue }}
    >
      {children}
    </SelectedStatueContext.Provider>
  );
}
