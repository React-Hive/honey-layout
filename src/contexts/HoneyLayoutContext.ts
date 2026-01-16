import { createContext } from 'react';
import type { HoneyTheme } from '@react-hive/honey-style';

import type {
  HoneyOverlayConfig,
  HoneyScreenState,
  HoneyOverlayId,
  HoneyActiveOverlay,
} from '~/types';

/**
 * Function to unregister a previously registered overlay.
 */
export type HoneyUnregisterOverlay = (targetOverlayId: HoneyOverlayId) => void;

/**
 * Function to register a new overlay and manage its lifecycle.
 *
 * @param overlayConfig - Configuration object for the overlay.
 */
export type HoneyRegisterOverlay = (overlayConfig: HoneyOverlayConfig) => HoneyActiveOverlay;

export interface HoneyLayoutContextValue {
  /**
   * Represents the theme object.
   */
  theme: HoneyTheme;
  /**
   * Represents the current state of the screen.
   */
  screenState: HoneyScreenState;
  /**
   * Active overlays.
   */
  overlays: HoneyActiveOverlay[];
  /**
   * Function to register a new overlay.
   */
  registerOverlay: HoneyRegisterOverlay;
  /**
   * Function to unregister an overlay.
   */
  unregisterOverlay: HoneyUnregisterOverlay;
}

export const HoneyLayoutContext = createContext<HoneyLayoutContextValue | undefined>(undefined);
