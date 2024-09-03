import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import type { HoneyScreenState } from '../types';
import type { UseHoneyMediaQueryOptions } from '../hooks';
import { useHoneyMediaQuery } from '../hooks';

type HoneyLayoutContextValue = {
  screenState: HoneyScreenState;
};

const HoneyContext = createContext<HoneyLayoutContextValue | undefined>(undefined);

type HoneyLayoutProviderProps = {
  mediaQueryOptions?: UseHoneyMediaQueryOptions;
};

export const HoneyLayoutProvider = ({
  children,
  mediaQueryOptions,
}: PropsWithChildren<HoneyLayoutProviderProps>) => {
  const screenState = useHoneyMediaQuery(mediaQueryOptions);

  const contextValue = useMemo<HoneyLayoutContextValue>(
    () => ({
      screenState,
    }),
    [screenState],
  );

  return <HoneyContext.Provider value={contextValue}>{children}</HoneyContext.Provider>;
};

export const useHoneyLayoutProvider = () => {
  const context = useContext(HoneyContext);
  if (!context) {
    throw new Error(
      'The `useHoneyLayoutProvider()` hook must be used inside <HoneyLayoutProvider/> component!',
    );
  }

  return context;
};
