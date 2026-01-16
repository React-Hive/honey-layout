import React, { useCallback } from 'react';
import { invokeIfFunction } from '@react-hive/honey-utils';
import type { FastOmit } from '@react-hive/honey-style';
import type { ReactNode } from 'react';

import { useRegisterHoneyOverlay } from '~/hooks';
import { mergeRefs } from '~/helpers';
import { HoneyFlex } from './HoneyFlex';
import type { HoneyActiveOverlay, HoneyOverlayId, Nullable } from '~/types';
import type { HoneyFlexProps } from './HoneyFlex';

export interface HoneyOverlayContext {
  /**
   * The current overlay instance, including methods and metadata for managing the overlay.
   */
  overlay: Nullable<HoneyActiveOverlay>;
  /**
   * Function to deactivate the overlay. Typically, triggers the `onDeactivate` callback.
   */
  deactivateOverlay: () => void;
}

export interface HoneyOverlayProps extends FastOmit<HoneyFlexProps, 'children'> {
  /**
   * The content of the overlay, either as static nodes or a function that receives the object
   * with the current overlay state and helper methods.
   */
  children: ReactNode | ((overlayContext: HoneyOverlayContext) => ReactNode);
  /**
   * Determines whether the overlay is currently active.
   */
  active: boolean;
  /**
   * An optional unique identifier for the overlay.
   */
  overlayId?: HoneyOverlayId;
  /**
   * Callback function invoked when the overlay is deactivated.
   * Typically called when the "Escape" key is pressed or another user-defined action triggers deactivation.
   */
  onDeactivate: () => void;
}

/**
 * A reusable overlay component integrated with the `HoneyLayoutProvider` system.
 *
 * Automatically registers/unregisters itself with the layout system and handles key events.
 *
 * @param props - Component configuration.
 *
 * @example
 * ```tsx
 * <HoneyOverlay
 *   active={isOpen}
 *   onDeactivate={() => setIsOpen(false)}
 * >
 *   {({ deactivateOverlay }) => (
 *     <div>
 *       <h2>Settings</h2>
 *       <button onClick={deactivateOverlay}>Close</button>
 *     </div>
 *   )}
 * </HoneyOverlay>
 * ```
 */
export const HoneyOverlay = ({
  ref,
  children,
  active,
  overlayId,
  onDeactivate,
  ...props
}: HoneyOverlayProps) => {
  const overlay = useRegisterHoneyOverlay(active, {
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

  const mergedRef = mergeRefs(overlay?.setContainerRef, ref);

  return (
    <HoneyFlex ref={mergedRef} inert={!active} {...props}>
      {invokeIfFunction(children, {
        overlay,
        deactivateOverlay: onDeactivate,
      })}
    </HoneyFlex>
  );
};
