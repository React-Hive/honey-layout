import React from 'react';
import type { ReferenceType } from '@floating-ui/react';

import { HoneyPopupTree } from './HoneyPopupTree';
import { HoneyPopupContent } from './HoneyPopupContent';
import type { HoneyPopupContentProps } from './HoneyPopupContent';

export interface HoneyPopupProps<
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean,
> extends HoneyPopupContentProps<Context, Reference, UseAutoSize> {
  /**
   * Whether to wrap the popup in a `FloatingTree`.
   * Required if you're using nested floating elements like tooltips or popups within a popup.
   *
   * @default false
   *
   * @see https://floating-ui.com/docs/floatingtree
   */
  useTree?: boolean;
}

/**
 * A popup component that provides floating behavior with customizable options.
 *
 * @template Context - Optional context type passed to floating UI.
 * @template Reference - The reference type used for positioning.
 * @template UseAutoSize - Enables auto-sizing behavior for content if `true`.
 */
export const HoneyPopup = <Context, Reference extends ReferenceType, UseAutoSize extends boolean>({
  useTree = false,
  ...props
}: HoneyPopupProps<Context, Reference, UseAutoSize>) => {
  return (
    <HoneyPopupTree enabled={useTree}>
      <HoneyPopupContent {...props} />
    </HoneyPopupTree>
  );
};
