import React, { useCallback } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

import type { HoneyActiveOverlay, HoneyOverlayId, Nullable } from '../types';
import type { HoneyBoxProps } from './HoneyBox';
import { HoneyFlexBox } from './HoneyFlexBox';
import { useRegisterHoneyOverlay } from '../hooks';

type OverlayContext = {
  /**
   * The current overlay instance, including methods and metadata for managing the overlay.
   */
  overlay: Nullable<HoneyActiveOverlay>;
  /**
   * Function to deactivate the overlay. Typically, triggers the `onDeactivate` callback.
   */
  deactivateOverlay: () => void;
};

export type HoneyOverlayProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> &
  HoneyBoxProps & {
    /**
     * The content of the overlay, either as static nodes or a function that receives the object
     * with the current overlay state and helper methods.
     */
    children: ReactNode | ((overlayContext: OverlayContext) => ReactNode);
    /**
     * Determines whether the overlay is currently active.
     */
    isActive: boolean;
    /**
     * An optional unique identifier for the overlay.
     */
    overlayId?: HoneyOverlayId;
    /**
     * Callback function invoked when the overlay is deactivated.
     * Typically called when the "Escape" key is pressed or another user-defined action triggers deactivation.
     */
    onDeactivate: () => void;
  };

/**
 * A reusable overlay component that manages active states and keyboard interactions.
 *
 * The `HoneyOverlay` component integrates with the `useRegisterHoneyOverlay` hook to:
 * - Automatically register/deregister the overlay.
 * - Handle keyboard events, such as closing the overlay with the "Escape" key.
 * - Provide a context to dynamically manage overlay content and state.
 *
 * @param {HoneyOverlayProps} props - The properties used to configure the overlay.
 */
export const HoneyOverlay = ({
  children,
  isActive,
  overlayId,
  onDeactivate,
  ...props
}: HoneyOverlayProps) => {
  const overlay = useRegisterHoneyOverlay(isActive, {
    id: overlayId,
    onKeyUp: useCallback(
      keyCode => {
        if (keyCode === 'Escape') {
          onDeactivate();
        }
      },
      [onDeactivate],
    ),
  });

  return (
    <HoneyFlexBox ref={overlay?.setContainerRef} aria-hidden={!isActive} {...props}>
      {typeof children === 'function'
        ? children({
            overlay,
            deactivateOverlay: onDeactivate,
          })
        : children}
    </HoneyFlexBox>
  );
};
