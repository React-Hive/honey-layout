import { useEffect } from 'react';

import { useHoneyLayout } from '~/hooks';
import type { HoneyOverlayId, HoneyOverlayEventListenerHandler } from '~/types';

interface UseHoneyOverlayOptions {
  onKeyUp?: HoneyOverlayEventListenerHandler;
}

/**
 * Hook for interacting with an active overlay managed by `HoneyLayoutProvider`.
 *
 * @param targetOverlayId - The unique ID of the overlay you want to interact with.
 * @param options - Optional configuration such as event handlers (e.g., `onKeyUp`).
 *
 * @returns The overlay instance matching the provided ID, or `undefined` if not found.
 *
 * @remarks
 * - This hook only works with overlays that are currently active.
 * - If the overlay is not active or not registered, `undefined` will be returned.
 * - Event handlers like `onKeyUp` are automatically registered and cleaned up for the overlay.
 *
 * @example
 * ```tsx
 * const overlay = useHoneyOverlay('my-overlay-id', {
 *   onKeyUp: (keyCode, e) => {
 *     if (keyCode === 'Escape') {
 *       console.log('Escape key pressed!');
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

  const overlay = overlays.find(overlay => overlay.id === targetOverlayId);

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
