import React, { useMemo } from 'react';
import { ThemeProvider, useTheme } from 'styled-components';
import type { DefaultTheme } from 'styled-components';
import type { PropsWithChildren } from 'react';

import { useHoneyMediaQuery } from '../hooks';
import { resolveDimension, resolveFont, resolveColor, resolveSpacing } from '../helpers';
import { HoneyLayoutContext } from '../contexts';
import { useHoneyOverlays } from './hooks';
import type { HoneyLayoutContextValue } from '../contexts';
import type { UseHoneyMediaQueryOptions } from '../hooks';

interface HoneyLayoutProviderContentProps {
  mediaQueryOptions?: UseHoneyMediaQueryOptions;
}

const HoneyLayoutProviderContent = ({
  children,
  mediaQueryOptions,
}: PropsWithChildren<HoneyLayoutProviderContentProps>) => {
  const theme = useTheme();

  const screenState = useHoneyMediaQuery(mediaQueryOptions);

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
    [theme, screenState, overlays, registerOverlay, unregisterOverlay],
  );

  return <HoneyLayoutContext.Provider value={contextValue}>{children}</HoneyLayoutContext.Provider>;
};

interface HoneyLayoutProviderProps extends HoneyLayoutProviderContentProps {
  theme: DefaultTheme;
}

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
