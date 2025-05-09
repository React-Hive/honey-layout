import React, { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

interface AppContextValue {
  isOpenMenu: boolean;
  toggleMenu: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [isOpenMenu, setIsOpenMenu] = useState(true);

  const contextValue = useMemo<AppContextValue>(
    () => ({
      isOpenMenu,
      toggleMenu: () => setIsOpenMenu(!isOpenMenu),
    }),
    [isOpenMenu],
  );

  return <AppContext value={contextValue}>{children}</AppContext>;
};

export const useCurrentApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }

  return context;
};
