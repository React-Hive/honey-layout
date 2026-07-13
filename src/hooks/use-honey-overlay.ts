import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { useHoneyLayout } from '../hooks';
import type {
  HoneyOverlayId,
  HoneyOverlayEventListenerHandler,
  Nullable,
  HoneyActiveOverlay,
} from '../types';

const subscribeToNothing = () => () => undefined;

interface UseHoneyOverlayOptions {
  /**
   * Whether the hook should resolve the overlay and attach event listeners.
   *
   * When `false`, the hook returns `null`, does not subscribe to overlay stack changes,
   * and does not attach an overlay event listener.
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * Callback fired when the target overlay receives a keyup event.
   *
   * The handler is attached only while the target overlay is active and the hook is enabled.
   * It is automatically removed when the overlay or handler changes, the hook is disabled,
   * or the component unmounts.
   */
  onKeyUp?: HoneyOverlayEventListenerHandler;
}

/**
 * Returns an active overlay by ID and optionally attaches a keyup event listener.
 *
 * The hook reads the overlay through the external overlay store exposed by
 * `HoneyLayoutProvider`. It subscribes to stack changes with `useSyncExternalStore`, but
 * selects only the requested overlay. Consequently, unrelated overlay stack changes do not
 * re-render the consuming component when the selected overlay instance remains unchanged.
 *
 * @param targetOverlayId - The ID of the active overlay to find.
 * @param options - Optional configuration for resolving the overlay and handling keyup events.
 *
 * @returns The matching active overlay, or `null` when the hook is disabled or the overlay is
 * not currently registered.
 *
 * @remarks
 * - The hook resolves only overlays that are currently registered.
 * - If `enabled` is `false`, the snapshot is `null` and no keyup listener is attached.
 * - If the target overlay is registered or unregistered, the consuming component is updated.
 * - Changes to unrelated overlays do not cause a re-render when the selected snapshot is equal.
 * - The `onKeyUp` listener is automatically cleaned up when its dependencies change.
 *
 * @example
 * ```tsx
 * const overlay = useHoneyOverlay('my-overlay-id', {
 *   enabled: isOpen,
 *   onKeyUp: keyCode => {
 *     if (keyCode === 'Escape') {
 *       closeOverlay();
 *     }
 *   },
 * });
 * ```
 */
export const useHoneyOverlay = (
  targetOverlayId: HoneyOverlayId,
  { enabled = true, onKeyUp }: UseHoneyOverlayOptions = {},
) => {
  const { getOverlaysSnapshot, subscribeOverlays } = useHoneyLayout();

  const getOverlaySnapshot = useCallback<() => Nullable<HoneyActiveOverlay>>(() => {
    if (!enabled) {
      return null;
    }

    return getOverlaysSnapshot().find(overlay => overlay.id === targetOverlayId) ?? null;
  }, [enabled, targetOverlayId]);

  const overlay = useSyncExternalStore(
    enabled ? subscribeOverlays : subscribeToNothing,
    getOverlaySnapshot,
    getOverlaySnapshot,
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
