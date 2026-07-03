import { useEffect, useMemo } from 'react';

import { useHoneyLayout } from '../hooks';
import type { HoneyOverlayId, HoneyOverlayEventListenerHandler } from '../types';

interface UseHoneyOverlayOptions {
  /**
   * Callback fired when the active target overlay receives a keyup event.
   *
   * The handler is registered only while the target overlay is active and is automatically
   * removed when the overlay changes, the handler changes, or the component unmounts.
   */
  onKeyUp?: HoneyOverlayEventListenerHandler;
}

/**
 * Returns an active overlay by ID and optionally attaches overlay event listeners.
 *
 * This hook looks up an overlay registered in `HoneyLayoutProvider` by its ID.
 * It can also subscribe to overlay-level events, such as `keyup`, for the matched overlay.
 *
 * @param targetOverlayId - The ID of the active overlay to find.
 * @param options - Optional overlay event handlers.
 *
 * @returns The matching active overlay instance, or `undefined` when the overlay is not registered.
 *
 * @remarks
 * - The hook only works with overlays that are currently active.
 * - If the overlay is inactive, unregistered, or already removed from the stack, `undefined` is returned.
 * - The `onKeyUp` listener is attached only to the matched overlay.
 * - Event listeners are automatically cleaned up when the overlay, handler, or component lifecycle changes.
 *
 * @example
 * ```tsx
 * const overlay = useHoneyOverlay('my-overlay-id', {
 *   onKeyUp: (keyCode, overlay, e) => {
 *     if (keyCode === 'Escape') {
 *      //
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
