import React, { useMemo } from 'react';
import { HoneyStyleProvider } from '@react-hive/honey-style';
import type { PropsWithChildren } from 'react';
import type { HoneyStyleProviderProps } from '@react-hive/honey-style';

import { useHoneyMediaQuery } from '../hooks';
import { HoneyLayoutContext } from '../contexts';
import { useHoneyOverlays } from './hooks';
import type { HoneyLayoutContextValue } from '../contexts';
import type { UseHoneyMediaQueryOptions } from '../hooks';

interface HoneyLayoutProviderProps extends HoneyStyleProviderProps {
  /**
   * Options used to derive the responsive screen state from the active theme.
   */
  mediaQueryOptions?: UseHoneyMediaQueryOptions;
}

/**
 * Provides Honey styling, responsive screen state, and overlay management to its descendants.
 *
 * Overlay state is held in a ref-backed external store. Registering or unregistering an overlay
 * notifies subscribed overlay consumers without updating this provider's React state or context
 * value. This prevents overlay stack changes from re-rendering the full layout subtree.
 *
 * The context value changes only when the theme or responsive screen state changes. Overlay
 * consumers should read the store through `useHoneyOverlay` or `useSyncExternalStore` rather
 * than attempting to read the overlay ref directly.
 *
 * @param props - The provider props, including the theme, children, style-provider options,
 * and optional media-query configuration.
 * @returns The configured Honey style and layout providers.
 *
 * @example
 * ```tsx
 * <HoneyLayoutProvider theme={theme} mediaQueryOptions={mediaQueryOptions}>
 *   <App />
 * </HoneyLayoutProvider>
 * ```
 */
export const HoneyLayoutProvider = ({
  children,
  theme,
  mediaQueryOptions,
  ...props
}: PropsWithChildren<HoneyLayoutProviderProps>) => {
  const screenState = useHoneyMediaQuery(theme, mediaQueryOptions);

  const { getOverlaysSnapshot, registerOverlay, subscribeOverlays, unregisterOverlay } =
    useHoneyOverlays();

  const contextValue = useMemo<HoneyLayoutContextValue>(
    () => ({
      theme,
      screenState,
      getOverlaysSnapshot,
      registerOverlay,
      subscribeOverlays,
      unregisterOverlay,
    }),
    [theme, screenState],
  );

  return (
    <HoneyStyleProvider theme={theme} {...props}>
      <HoneyLayoutContext value={contextValue}>{children}</HoneyLayoutContext>
    </HoneyStyleProvider>
  );
};
