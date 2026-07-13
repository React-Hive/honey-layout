import { createContext } from 'react';
import type { HoneyTheme } from '@react-hive/honey-style';

import type {
  HoneyOverlayConfig,
  HoneyScreenState,
  HoneyOverlayId,
  HoneyActiveOverlay,
} from '../types';

/**
 * Returns the current active overlay stack snapshot.
 *
 * The returned array keeps the same identity until the overlay stack changes, allowing it to
 * be consumed safely by `useSyncExternalStore`. Consumers must not mutate the snapshot.
 *
 * @returns The active overlays in registration order.
 */
export type HoneyGetOverlaysSnapshot = () => readonly HoneyActiveOverlay[];

/**
 * Subscribes to active overlay stack changes.
 *
 * @param subscriber - Callback invoked when a new overlay stack snapshot is available.
 * @returns A cleanup function that removes the subscriber.
 */
export type HoneySubscribeOverlays = (subscriber: () => void) => () => void;

/**
 * Unregisters a previously registered overlay.
 *
 * @param targetOverlayId - The ID of the overlay to unregister.
 */
export type HoneyUnregisterOverlay = (targetOverlayId: HoneyOverlayId) => void;

/**
 * Registers a new active overlay.
 *
 * @param overlayConfig - Configuration for the overlay.
 * @returns The registered active overlay instance.
 */
export type HoneyRegisterOverlay = (overlayConfig: HoneyOverlayConfig) => HoneyActiveOverlay;

/**
 * Values and overlay-store operations exposed by `HoneyLayoutProvider`.
 */
export interface HoneyLayoutContextValue {
  /**
   * The active Honey theme.
   */
  theme: HoneyTheme;
  /**
   * The current responsive screen state.
   */
  screenState: HoneyScreenState;
  /**
   * Returns the current overlay stack snapshot without subscribing the caller to changes.
   */
  getOverlaysSnapshot: HoneyGetOverlaysSnapshot;
  /**
   * Subscribes a consumer to overlay stack changes without re-rendering the layout provider.
   */
  subscribeOverlays: HoneySubscribeOverlays;
  /**
   * Registers an overlay and publishes a new overlay stack snapshot.
   */
  registerOverlay: HoneyRegisterOverlay;
  /**
   * Unregisters an overlay and publishes a new snapshot when the overlay existed.
   */
  unregisterOverlay: HoneyUnregisterOverlay;
}

export const HoneyLayoutContext = createContext<HoneyLayoutContextValue | undefined>(undefined);
