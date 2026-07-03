import { useEffect, useMemo } from 'react';

import { useHoneyLayout } from '../hooks';
import type {
  HoneyOverlayId,
  HoneyOverlayEventListenerHandler,
  HoneyActiveOverlay,
  Nullable,
} from '../types';

interface UseHoneyOverlayOptions {
  /**
   * Whether the hook should resolve the overlay and attach event listeners.
   *
   * When `false`, the hook returns `null` and does not register any listeners.
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * Callback fired when the active target overlay receives a keyup event.
   *
   * The handler is registered only while the target overlay is active, the hook is enabled,
   * and the handler is provided. It is automatically removed when the overlay changes,
   * the handler changes, the hook is disabled, or the component unmounts.
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
 * @param options - Optional configuration for resolving the overlay and attaching event handlers.
 *
 * @returns The matching active overlay instance, or `null` when the hook is disabled
 * or the overlay is not currently registered.
 *
 * @remarks
 * - The hook only works with overlays that are currently active.
 * - If `enabled` is `false`, the hook returns `null` and does not attach listeners.
 * - If the overlay is inactive, unregistered, or already removed from the stack, `null` is returned.
 * - The `onKeyUp` listener is attached only to the matched overlay while the hook is enabled.
 * - Event listeners are automatically cleaned up when the overlay, handler, enabled state,
 * or component lifecycle changes.
 *
 * @example
 * ```tsx
 * const overlay = useHoneyOverlay('my-overlay-id', {
 *   enabled: isOpen,
 *   onKeyUp: (keyCode, overlay, e) => {
 *     if (keyCode === 'Escape') {
 *       // Handle Escape key.
 *     }
 *   },
 * });
 * ```
 */
export const useHoneyOverlay = (
  targetOverlayId: HoneyOverlayId,
  { enabled = true, onKeyUp }: UseHoneyOverlayOptions = {},
) => {
  const { overlays } = useHoneyLayout();

  const overlay = useMemo<Nullable<HoneyActiveOverlay>>(
    () => (enabled ? (overlays.find(overlay => overlay.id === targetOverlayId) ?? null) : null),
    [enabled, overlays, targetOverlayId],
  );

  useEffect(() => {
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
