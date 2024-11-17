import { useEffect, useRef } from 'react';

import type { HoneyOverlay, HoneyOverlayConfig, Nullable } from '../types';
import { useHoneyLayout } from './use-honey-layout';

export const useRegisterHoneyOverlay = (isRegister: boolean, overlayConfig: HoneyOverlayConfig) => {
  const { registerOverlay, unregisterOverlay } = useHoneyLayout();

  const overlayRef = useRef<Nullable<HoneyOverlay>>(null);

  useEffect(() => {
    if (!isRegister) {
      return;
    }

    const overlay = registerOverlay(overlayConfig);
    overlayRef.current = overlay;

    return () => {
      overlayRef.current = null;

      unregisterOverlay(overlay.id);
    };
  }, [isRegister, overlayConfig.onKeyUp]);

  return overlayRef.current;
};
