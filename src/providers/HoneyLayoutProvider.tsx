import React, { useMemo } from 'react';
import { HoneyStyleProvider } from '@react-hive/honey-style';
import type { PropsWithChildren } from 'react';
import type { HoneyStyleProviderProps } from '@react-hive/honey-style';

import { useHoneyMediaQuery } from '~/hooks';
import { HoneyLayoutContext } from '~/contexts';
import { useHoneyOverlays } from './hooks';
import type { HoneyLayoutContextValue } from '~/contexts';
import type { UseHoneyMediaQueryOptions } from '~/hooks';

interface HoneyLayoutProviderProps extends HoneyStyleProviderProps {
  mediaQueryOptions?: UseHoneyMediaQueryOptions;
}

export const HoneyLayoutProvider = ({
  children,
  theme,
  mediaQueryOptions,
  ...props
}: PropsWithChildren<HoneyLayoutProviderProps>) => {
  const screenState = useHoneyMediaQuery(theme, mediaQueryOptions);

  const { overlays, registerOverlay, unregisterOverlay } = useHoneyOverlays();

  const contextValue = useMemo<HoneyLayoutContextValue>(
    () => ({
      theme,
      screenState,
      overlays,
      registerOverlay,
      unregisterOverlay,
    }),
    [theme, screenState, overlays],
  );

  return (
    <HoneyStyleProvider theme={theme} {...props}>
      <HoneyLayoutContext value={contextValue}>{children}</HoneyLayoutContext>
    </HoneyStyleProvider>
  );
};
