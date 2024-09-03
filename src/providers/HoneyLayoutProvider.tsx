import type { PropsWithChildren } from 'react';
import type { DefaultTheme } from 'styled-components';
import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';

import type { HoneyScreenState } from '../types';
import type { UseHoneyMediaQueryOptions } from '../hooks';
import { useHoneyMediaQuery } from '../hooks';

type HoneyLayoutContextValue = {
  screenState: HoneyScreenState;
};

const HoneyContext = createContext<HoneyLayoutContextValue | undefined>(undefined);

type HoneyLayoutProviderContentProps = {
  mediaQueryOptions?: UseHoneyMediaQueryOptions;
};

const HoneyLayoutProviderContent = ({
  children,
  mediaQueryOptions,
}: PropsWithChildren<HoneyLayoutProviderContentProps>) => {
  const screenState = useHoneyMediaQuery(mediaQueryOptions);

  const contextValue = useMemo<HoneyLayoutContextValue>(
    () => ({
      screenState,
    }),
    [screenState],
  );

  return <HoneyContext.Provider value={contextValue}>{children}</HoneyContext.Provider>;
};

type HoneyLayoutProviderProps = HoneyLayoutProviderContentProps & {
  theme: DefaultTheme;
};

export const HoneyLayoutProvider = ({
  theme,
  ...props
}: PropsWithChildren<HoneyLayoutProviderProps>) => {
  return (
    <ThemeProvider theme={theme}>
      <HoneyLayoutProviderContent {...props} />
    </ThemeProvider>
  );
};

export const useHoneyLayout = () => {
  const context = useContext(HoneyContext);
  if (!context) {
    throw new Error(
      'The `useHoneyLayout()` hook must be used inside <HoneyLayoutProvider/> component!',
    );
  }

  return context;
};
