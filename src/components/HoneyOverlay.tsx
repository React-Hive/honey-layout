import React, { useCallback } from 'react';
import { invokeIfFunction } from '@react-hive/honey-utils';
import { useHoneyLatest } from '@react-hive/honey-hooks';
import type { FastOmit } from '@react-hive/honey-style';
import type { ReactNode } from 'react';

import { useRegisterHoneyOverlay } from '../hooks';
import { mergeRefs } from '../helpers';
import { HoneyFlex } from './HoneyFlex';
import type {
  HoneyActiveOverlay,
  HoneyOverlayEventListenerHandler,
  HoneyOverlayId,
  Nullable,
} from '../types';
import type { HoneyFlexProps } from './HoneyFlex';

export interface HoneyOverlayContext {
  /**
   * The registered overlay instance, including methods and metadata used by the
   * layout system to manage the overlay.
   *
   * `null` when the overlay is not currently registered.
   */
  overlay: Nullable<HoneyActiveOverlay>;
  /**
   * Indicates whether the overlay is currently active.
   */
  isActive: boolean;
  /**
   * Deactivates the overlay.
   *
   * Usually passed to child content so it can close the overlay from inside,
   * for example, from a close button.
   */
  deactivateOverlay: () => void;
}

export interface HoneyOverlayProps extends FastOmit<HoneyFlexProps, 'children' | 'onKeyUp'> {
  /**
   * The overlay content.
   *
   * Can be provided as static React content or as a render function that receives
   * the current overlay context.
   */
  children: ReactNode | ((overlayContext: HoneyOverlayContext) => ReactNode);
  /**
   * Controls whether the overlay is active.
   *
   * When active, the overlay is registered in the layout system and can receive
   * overlay-level events. When inactive, the rendered container is marked as inert.
   */
  active: boolean;
  /**
   * Optional unique identifier for the overlay.
   *
   * Useful when the overlay needs to be referenced or managed by id within the
   * layout system.
   */
  overlayId?: HoneyOverlayId;
  /**
   * Callback invoked when the overlay should be deactivated.
   *
   * By default, this is called when the Escape key is released. It is also exposed
   * to render-function children as `deactivateOverlay`.
   */
  onDeactivate: () => void;
  /**
   * Optional overlay-level key up event handler.
   *
   * When provided, it overrides the default Escape key handling. If Escape should
   * still close the overlay, call `onDeactivate` from inside this handler.
   */
  onKeyUp?: HoneyOverlayEventListenerHandler;
}

/**
 * A reusable overlay component integrated with the `HoneyLayoutProvider` system.
 *
 * The component registers itself with the overlay system when active, provides
 * overlay context to render-function children, and disables interaction with its
 * content when inactive by applying the `inert` attribute.
 *
 * By default, releasing the Escape key deactivates the overlay. Custom key handling
 * can be provided through `onKeyUp`.
 *
 * @param props - Overlay component props.
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
 *
 * @example
 * ```tsx
 * <HoneyOverlay
 *   active={isOpen}
 *   onDeactivate={() => setIsOpen(false)}
 *   onKeyUp={(keyCode) => {
 *     if (keyCode === 'Escape') {
 *       setIsOpen(false);
 *     }
 *   }}
 * >
 *   Overlay content
 * </HoneyOverlay>
 * ```
 */
export const HoneyOverlay = ({
  ref,
  children,
  active,
  overlayId,
  onDeactivate,
  onKeyUp,
  ...props
}: HoneyOverlayProps) => {
  const onKeyUpRef = useHoneyLatest(onKeyUp);
  const onDeactivateRef = useHoneyLatest(onDeactivate);

  const handleKeyUp = useCallback<HoneyOverlayEventListenerHandler>((keyCode, ...args) => {
    if (onKeyUpRef.current) {
      onKeyUpRef.current(keyCode, ...args);
    } else if (keyCode === 'Escape') {
      onDeactivateRef.current();
    }
  }, []);

  const overlay = useRegisterHoneyOverlay(active, {
    id: overlayId,
    onKeyUp: handleKeyUp,
  });

  const mergedRef = mergeRefs(overlay?.setContainerRef, ref);

  return (
    <HoneyFlex ref={mergedRef} inert={!active} {...props}>
      {invokeIfFunction(children, {
        overlay,
        isActive: active,
        deactivateOverlay: onDeactivateRef.current,
      })}
    </HoneyFlex>
  );
};
