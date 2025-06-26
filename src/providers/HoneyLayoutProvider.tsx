import React, { useMemo } from 'react';
import {
  resolveFont,
  resolveColor,
  resolveDimension,
  HoneyStyleProvider,
} from '@react-hive/honey-style';
import type { PropsWithChildren } from 'react';
import type { HoneyStyleContextValue } from '@react-hive/honey-style';

import { useHoneyMediaQuery } from '../hooks';
import { resolveSpacing } from '../helpers';
import { HoneyLayoutContext } from '../contexts';
import { useHoneyOverlays } from './hooks';
import type { HoneyLayoutContextValue } from '../contexts';
import type { UseHoneyMediaQueryOptions } from '../hooks';

interface HoneyLayoutProviderProps extends HoneyStyleContextValue {
  mediaQueryOptions?: UseHoneyMediaQueryOptions;
}

export const HoneyLayoutProvider = ({
  children,
  theme,
  mediaQueryOptions,
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
      resolveSpacing: (...args) => resolveSpacing(...args)({ theme }),
      resolveColor: (...args) => resolveColor(...args)({ theme }),
      resolveFont: (...args) => resolveFont(...args)({ theme }),
      resolveDimension: (...args) => resolveDimension(...args)({ theme }),
    }),
    [theme, screenState, overlays],
  );

  return (
    <HoneyStyleProvider theme={theme}>
      <HoneyLayoutContext value={contextValue}>{children}</HoneyLayoutContext>
    </HoneyStyleProvider>
  );
};
