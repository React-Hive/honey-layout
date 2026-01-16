import { useEffect, useRef } from 'react';

import { useHoneyLayout } from '~/hooks';
import type { HoneyActiveOverlay, HoneyOverlayConfig, Nullable } from '~/types';

/**
 * A hook for registering and managing an overlay in the layout system.
 *
 * @param shouldRegister - A flag indicating whether the overlay should be registered.
 * @param overlayConfig - Configuration object specifying overlay behavior.
 *
 * @returns The registered overlay instance, or null if not registered.
 */
export const useRegisterHoneyOverlay = (
  shouldRegister: boolean,
  overlayConfig: HoneyOverlayConfig,
): Nullable<HoneyActiveOverlay> => {
  const { registerOverlay, unregisterOverlay } = useHoneyLayout();

  const overlayRef = useRef<Nullable<HoneyActiveOverlay>>(null);

  useEffect(() => {
    if (!shouldRegister) {
      return;
    }

    const overlay = registerOverlay(overlayConfig);
    overlayRef.current = overlay;

    return () => {
      overlayRef.current = null;

      unregisterOverlay(overlay.id);
    };
  }, [shouldRegister, overlayConfig.onKeyUp]);

  return overlayRef.current;
};
