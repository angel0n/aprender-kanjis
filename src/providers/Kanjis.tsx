'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type KanjisContextType = {
  selectedKanjis: Set<string>;
  setSelectedKanjis: (kanjis: Set<string>) => void;
};

const KanjisContext = createContext<KanjisContextType | undefined>(undefined);

export const useKanjis = () => {
  const context = useContext(KanjisContext);
  if (!context) {
    throw new Error('useKanjis deve ser usado dentro de um KanjisProvider');
  }
  return context;
};

export function KanjisProvider({ children }: { children: ReactNode }) {
  const [selectedKanjis, setSelectedKanjis] = useState<Set<string>>(new Set());

  return (
    <KanjisContext.Provider value={{ selectedKanjis, setSelectedKanjis }}>
      {children}
    </KanjisContext.Provider>
  );
}
