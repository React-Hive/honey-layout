import { useCallback, useRef } from 'react';
import type { RefObject } from 'react';

import { parse2DMatrix } from '@react-hive/honey-utils';

import type { Nullable } from '../types';
import type { HoneyDragHandlers, HoneyDragOnMoveHandler } from './use-honey-drag';
import type { UseHoneyResizeHandler } from './use-honey-resize';
import { useHoneyDrag } from './use-honey-drag';
import { useHoneyResize } from './use-honey-resize';

type ScrollAxis = 'x' | 'y' | 'both';

export interface UseHoneySyntheticScrollOptions<Element extends HTMLElement> extends Pick<
  HoneyDragHandlers<Element>,
  'onStartDrag' | 'onEndDrag'
> {
  /**
   * Axis along which synthetic scrolling is enabled.
   *
   * - `'x'` — horizontal only
   * - `'y'` — vertical only
   * - `'both'` — horizontal and vertical
   *
   * @default 'both'
   */
  axis?: ScrollAxis;
  /**
   * Percentage of the container size used as an overscroll buffer
   * on each enabled axis.
   *
   * This allows limited dragging beyond the natural content bounds
   * before movement is clamped.
   *
   * A value of `0` disables overscroll entirely.
   *
   * @default 0
   */
  availableWindowPct?: number;
  /**
   * Whether to clear any applied translation transforms when the window resizes.
   *
   * Useful to keep the layout state consistent after dimension changes.
   *
   * @default true
   */
  resetOnResize?: boolean;
}

/**
 * Enables synthetic scrolling for a container using pointer-based drag gestures.
 *
 * Instead of relying on native scrollbars, this hook translates the container
 * using CSS transforms in response to drag input.
 *
 * ### Key characteristics
 * - Dragging is only applied when content overflows the container on a given axis.
 * - Movement is clamped within calculated bounds, with optional overscroll allowance.
 * - Scroll position is stored purely in `transform: translate(...)`.
 * - Active transforms can be automatically cleared on window resize.
 *
 * ### Internals
 * - Uses {@link useHoneyDrag} to track mouse / touch movement.
 * - Uses {@link useHoneyResize} to optionally reset scroll state on resize.
 *
 * @template Element - The HTML element type of the scrollable container.
 *
 * @param options - Configuration controlling axes, boundaries, and lifecycle behavior.
 *
 * @returns A ref that must be attached to the scrollable container element.
 */
export const useHoneySyntheticScroll = <Element extends HTMLElement>({
  axis = 'both',
  availableWindowPct = 0,
  onStartDrag,
  onEndDrag,
  resetOnResize = true,
}: UseHoneySyntheticScrollOptions<Element> = {}): RefObject<Nullable<Element>> => {
  const scrollableContainerRef = useRef<Nullable<Element>>(null);

  /**
   * Handles drag movement and applies clamped translation along the enabled axis or axes.
   *
   * For each axis:
   * - Skip processing if there is no overflow.
   * - Compute the candidate translate value from the drag delta.
   * - Clamp movement within calculated min / max bounds.
   */
  const onMoveDrag = useCallback<HoneyDragOnMoveHandler<Element>>(
    scrollableContainer =>
      async ({ deltaX, deltaY }) => {
        const { translateX, translateY } = parse2DMatrix(scrollableContainer);

        let nextX = translateX;
        let nextY = translateY;
        let handled = false;

        if (axis === 'x' || axis === 'both') {
          const overflowX = scrollableContainer.scrollWidth - scrollableContainer.clientWidth;

          if (overflowX > 0) {
            const thresholdX = scrollableContainer.clientWidth * (availableWindowPct / 100);

            const candidateX = translateX + deltaX;

            const minX = -(overflowX + thresholdX);
            const maxX = thresholdX;

            if ((deltaX < 0 && candidateX >= minX) || (deltaX > 0 && candidateX <= maxX)) {
              nextX = candidateX;
              handled = true;
            }
          }
        }

        if (axis === 'y' || axis === 'both') {
          const overflowY = scrollableContainer.scrollHeight - scrollableContainer.clientHeight;

          if (overflowY > 0) {
            const thresholdY = scrollableContainer.clientHeight * (availableWindowPct / 100);

            const candidateY = translateY + deltaY;

            const minY = -(overflowY + thresholdY);
            const maxY = thresholdY;

            if ((deltaY < 0 && candidateY >= minY) || (deltaY > 0 && candidateY <= maxY)) {
              nextY = candidateY;
              handled = true;
            }
          }
        }

        // Apply transform only when at least one axis was updated
        if (handled) {
          scrollableContainer.style.transform = `translate(${nextX}px, ${nextY}px)`;
        }

        return handled;
      },
    [availableWindowPct],
  );

  useHoneyDrag(scrollableContainerRef, {
    onStartDrag,
    onMoveDrag,
    onEndDrag,
  });

  const resizeHandler = useCallback<UseHoneyResizeHandler>(() => {
    const scrollableContainer = scrollableContainerRef.current;
    if (scrollableContainer) {
      scrollableContainer.style.removeProperty('transform');
    }
  }, []);

  useHoneyResize(resizeHandler, {
    enabled: resetOnResize,
  });

  return scrollableContainerRef;
};
