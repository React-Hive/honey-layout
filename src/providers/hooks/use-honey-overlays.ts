import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import type {
  HoneyKeyboardEventCode,
  HoneyActiveOverlay,
  HoneyOverlayEventListener,
  Nullable,
} from '../../types';
import type { HoneyRegisterOverlay, HoneyUnregisterOverlay } from '../../contexts';
import { generateUniqueId } from '../../helpers';

/**
 * Hook to manage a stack of overlays, allowing registration and unregistration of overlays,
 * as well as handling keyboard events for the topmost overlay.
 */
export const useHoneyOverlays = () => {
  const overlaysRef = useRef<HoneyActiveOverlay[]>([]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      const overlays = overlaysRef.current;
      if (!overlays.length) {
        // No overlays to handle key events
        return;
      }

      const topLevelOverlay = overlays[overlays.length - 1];

      topLevelOverlay.notifyListeners('keyup', e.code as HoneyKeyboardEventCode, e);
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  /**
   * Registers a new overlay and adds it to the stack.
   *
   * @param overlayConfig - The configuration for the overlay, including optional ID and event handlers.
   *
   * @returns The registered overlay object.
   */
  const registerOverlay = useCallback<HoneyRegisterOverlay>(overlayConfig => {
    const overlayId = overlayConfig.id ?? generateUniqueId();

    const listeners: HoneyOverlayEventListener[] = [['keyup', overlayConfig.onKeyUp]];
    const containerRef: RefObject<Nullable<HTMLDivElement>> = {
      current: null,
    };

    const overlay: HoneyActiveOverlay = {
      containerRef,
      id: overlayId,
      setContainerRef: element => {
        containerRef.current = element;
      },
      addListener: (type, handler) => {
        listeners.push([type, handler]);
      },
      removeListener: (targetType, targetHandler) => {
        const targetListenerIndex = listeners.findIndex(
          ([type, listenerHandler]) => type === targetType && listenerHandler === targetHandler,
        );

        if (targetListenerIndex !== -1) {
          listeners.splice(targetListenerIndex, 1);
        }
      },
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

    overlaysRef.current.push(overlay);

    return overlay;
  }, []);

  /**
   * Unregisters an overlay by its ID and removes it from the stack.
   *
   * @param targetOverlayId - The ID of the overlay to be removed.
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
