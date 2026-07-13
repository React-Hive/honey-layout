import { useCallback, useEffect, useRef } from 'react';
import { generateEphemeralId } from '@react-hive/honey-utils';
import type { RefObject } from 'react';

import type {
  HoneyActiveOverlay,
  HoneyKeyboardEventCode,
  HoneyOverlayEventListener,
  Nullable,
} from '../../types';
import type { HoneyRegisterOverlay, HoneyUnregisterOverlay } from '../../contexts';

/**
 * Manages the active overlay stack and global keyboard event dispatching.
 *
 * The hook keeps registered overlays in stack order, where the latest registered overlay
 * is treated as the top-level overlay. Keyboard events are forwarded only to the top-level
 * overlay, allowing nested or overlapping overlays to handle key interactions predictably.
 *
 * @returns An object containing the active overlays stack and helper methods for registering
 * and unregistering overlays.
 */
export const useHoneyOverlays = () => {
  const overlaysRef = useRef<HoneyActiveOverlay[]>([]);

  useEffect(() => {
    /**
     * Handles global keyup events and forwards them to the top-level overlay.
     *
     * Only the latest registered overlay receives keyboard events. This prevents inactive
     * or visually hidden overlays lower in the stack from reacting to the same key press.
     *
     * @param e - The native keyboard event emitted by the document.
     */
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!overlaysRef.current.length) {
        // No overlays to handle key events.
        return;
      }

      const topLevelOverlay = overlaysRef.current[overlaysRef.current.length - 1];

      topLevelOverlay.notifyListeners('keyup', e.code as HoneyKeyboardEventCode, e);
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  /**
   * Registers a new overlay and adds it to the top of the overlay stack.
   *
   * If no custom ID is provided, an ephemeral ID is generated automatically.
   * The returned overlay object exposes methods for storing its container element,
   * subscribing to overlay events, removing event listeners, and notifying registered
   * listeners when matching events occur.
   *
   * @param overlayConfig - The overlay configuration, including an optional ID, optional keyup
   * handler, and optional list of keyboard codes the overlay should listen to.
   *
   * @returns The registered active overlay instance.
   */
  const registerOverlay = useCallback<HoneyRegisterOverlay>(overlayConfig => {
    const overlayId = overlayConfig.id ?? generateEphemeralId();

    const listeners: HoneyOverlayEventListener[] = [['keyup', overlayConfig.onKeyUp]];
    const containerRef: RefObject<Nullable<HTMLDivElement>> = {
      current: null,
    };

    const overlay: HoneyActiveOverlay = {
      containerRef,
      id: overlayId,
      /**
       * Stores the overlay container element reference.
       *
       * This allows consumers and overlay helpers to access the DOM element associated
       * with the active overlay after it has been mounted.
       *
       * @param element - The overlay container element, or `null` when unavailable.
       */
      setContainerRef: element => {
        containerRef.current = element;
      },
      /**
       * Adds a listener for a supported overlay event.
       *
       * @param type - The overlay event type to listen for.
       * @param handler - The event handler to call when the event is notified.
       */
      addListener: (type, handler) => {
        listeners.push([type, handler]);
      },
      /**
       * Removes a previously registered overlay event listener.
       *
       * The listener is removed only when both the event type and handler reference match.
       *
       * @param targetType - The event type of the listener to remove.
       * @param targetHandler - The exact handler reference to remove.
       */
      removeListener: (targetType, targetHandler) => {
        const targetListenerIndex = listeners.findIndex(
          ([type, listenerHandler]) => type === targetType && listenerHandler === targetHandler,
        );

        if (targetListenerIndex !== -1) {
          listeners.splice(targetListenerIndex, 1);
        }
      },
      /**
       * Notifies matching listeners for a specific overlay event.
       *
       * If `listenKeys` is provided in the overlay config, listeners are called only when
       * the received key code is included in that list. When no `listenKeys` are provided,
       * all key codes are accepted.
       *
       * The native event is prevented before listeners are called, ensuring handled overlay
       * keyboard interactions do not trigger default browser behaviour.
       *
       * @param targetEventType - The event type being dispatched.
       * @param keyCode - The keyboard code associated with the event.
       * @param e - The native keyboard event.
       */
      notifyListeners: (targetEventType, keyCode, e) => {
        const listenKeys = overlayConfig.listenKeys ?? [];

        if (!listenKeys.length || listenKeys.includes(keyCode)) {
          e.preventDefault();

          listeners.forEach(([eventType, listener]) => {
            if (eventType === targetEventType) {
              listener(keyCode, overlay, e);
            }
          });
        }
      },
    };

    overlaysRef.current = [...overlaysRef.current, overlay];

    return overlay;
  }, []);

  /**
   * Unregisters an overlay by ID and removes it from the overlay stack.
   *
   * This should usually be called when an overlay is deactivated or unmounted.
   *
   * @param targetOverlayId - The ID of the overlay to remove.
   */
  const unregisterOverlay = useCallback<HoneyUnregisterOverlay>(targetOverlayId => {
    overlaysRef.current = overlaysRef.current.filter(overlay => overlay.id !== targetOverlayId);
  }, []);

  return {
    overlays: overlaysRef.current,
    registerOverlay,
    unregisterOverlay,
  };
};
