import type { RefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';

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
  const [overlays, setOverlays] = useState<HoneyActiveOverlay[]>([]);

  useEffect(() => {
    if (!overlays.length) {
      // No overlays to handle key events if the stack is empty
      return;
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const topLevelOverlay = overlays[overlays.length - 1];

      topLevelOverlay.notifyListeners('keyup', e.code as HoneyKeyboardEventCode, e);
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [overlays]);

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
      notifyListeners: (targetType, keyCode, e) => {
        if (!overlayConfig.listenKeys?.length || overlayConfig.listenKeys.includes(keyCode)) {
          e.preventDefault();

          listeners.forEach(([type, listenerHandler]) => {
            if (type === targetType) {
              listenerHandler(keyCode, overlay, e);
            }
          });
        }
      },
    };

    setOverlays(prevActiveOverlays => [...prevActiveOverlays, overlay]);

    return overlay;
  }, []);

  /**
   * Unregisters an overlay by its ID and removes it from the stack.
   *
   * @param targetOverlayId - The ID of the overlay to be removed.
   */
  const unregisterOverlay = useCallback<HoneyUnregisterOverlay>(targetOverlayId => {
    setOverlays(prevActiveOverlays =>
      prevActiveOverlays.filter(overlay => overlay.id !== targetOverlayId),
    );
  }, []);

  return {
    overlays,
    registerOverlay,
    unregisterOverlay,
  };
};
