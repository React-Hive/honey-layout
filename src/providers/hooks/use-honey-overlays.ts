import { useCallback, useEffect, useState } from 'react';

import type { HoneyKeyboardEventCode, HoneyOverlay, HoneyOverlayEventListener } from '../../types';
import type { HoneyRegisterOverlay, HoneyUnregisterOverlay } from '../../contexts';
import { generateUniqueId } from '../../helpers';

/**
 * Hook to manage a stack of overlays, allowing registration and unregistration of overlays,
 * as well as handling keyboard events.
 */
export const useHoneyOverlays = () => {
  const [overlays, setOverlays] = useState<HoneyOverlay[]>([]);

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

  const registerOverlay = useCallback<HoneyRegisterOverlay>(overlayConfig => {
    const overlayId = overlayConfig.id ?? generateUniqueId();

    const listeners: HoneyOverlayEventListener[] = [['keyup', overlayConfig.onKeyUp]];

    const overlay: HoneyOverlay = {
      id: overlayId,
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
              listenerHandler(keyCode, e);
            }
          });
        }
      },
    };

    setOverlays(prevActiveOverlays => [...prevActiveOverlays, overlay]);

    return overlay;
  }, []);

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
