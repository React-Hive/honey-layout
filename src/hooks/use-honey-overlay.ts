import { useEffect, useMemo } from 'react';

import type { HoneyOverlayId, HoneyOverlayEventListenerHandler } from '../types';
import { useHoneyLayout } from './use-honey-layout';

type UseHoneyOverlayOptions = {
  onKeyUp?: HoneyOverlayEventListenerHandler;
};

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
