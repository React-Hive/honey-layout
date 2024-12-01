import React, { useCallback } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

import type { HoneyActiveOverlay, HoneyOverlayId, Nullable } from '../types';
import type { HoneyBoxProps } from './HoneyBox';
import { HoneyFlexBox } from './HoneyFlexBox';
import { useRegisterHoneyOverlay } from '../hooks';

type HoneyOverlayProps = HTMLAttributes<HTMLDivElement> &
  HoneyBoxProps & {
    /**
     * The content of the overlay, either as static nodes or a function that receives the active overlay object.
     */
    children: ReactNode | ((overlay: Nullable<HoneyActiveOverlay>) => ReactNode);
    /**
     * Determines whether the overlay is currently active.
     */
    isActive: boolean;
    /**
     * An optional unique identifier for the overlay.
     */
    overlayId?: HoneyOverlayId;
    /**
     * Callback invoked when the overlay is closed.
     */
    onClose: () => void;
  };

/**
 * Component for creating overlays that can handle active states and keyboard interactions.
 *
 * @param {HoneyOverlayProps} props - The properties for configuring the overlay.
 */
export const HoneyOverlay = ({
  children,
  isActive,
  overlayId,
  onClose,
  ...props
}: HoneyOverlayProps) => {
  const overlay = useRegisterHoneyOverlay(isActive, {
    id: overlayId,
    onKeyUp: useCallback(
      keyCode => {
        if (keyCode === 'Escape') {
          onClose();
        }
      },
      [onClose],
    ),
  });

  return (
    <HoneyFlexBox ref={overlay?.setContainerRef} aria-hidden={!isActive} {...props}>
      {typeof children === 'function' ? children(overlay) : children}
    </HoneyFlexBox>
  );
};
