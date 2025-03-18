import { useEffect, useMemo } from 'react';

import type { HoneyOverlayId, HoneyOverlayEventListenerHandler } from '../types';
import { useHoneyLayout } from './use-honey-layout';

interface UseHoneyOverlayOptions {
  onKeyUp?: HoneyOverlayEventListenerHandler;
}

/**
 * Hook to interact with a specific overlay managed by the `HoneyLayoutProvider`.
 *
 * @param targetOverlayId - The unique identifier of the overlay to interact with.
 * @param options - Configuration options for the overlay, such as keyboard event handling.
 *
 * @returns The overlay object associated with the provided `targetOverlayId`, or `undefined` if not found.
 *
 * @example
 * ```tsx
 * const overlay = useHoneyOverlay('my-overlay-id', {
 *   onKeyUp: (keyCode, e) => {
 *     if (keyCode === 'Escape') {
 *       console.log('Escape key pressed');
 *     }
 *   },
 * });
 * ```
 */
export const useHoneyOverlay = (
  targetOverlayId: HoneyOverlayId,
  { onKeyUp }: UseHoneyOverlayOptions = {},
) => {
  const { overlays } = useHoneyLayout();

  // Find the overlay with the matching ID using `useMemo` for performance optimization
  const overlay = useMemo(
    () => overlays.find(overlay => overlay.id === targetOverlayId),
    [overlays, targetOverlayId],
  );

  useEffect(() => {
    // If no overlay is found or no `onKeyUp` handler is provided, skip setting up the listener
    if (!overlay || !onKeyUp) {
      return;
    }

    overlay.addListener('keyup', onKeyUp);

    return () => {
      overlay.removeListener('keyup', onKeyUp);
    };
  }, [overlay, onKeyUp]);

  return overlay;
};
