import { useCallback, useRef } from 'react';
import type { RefObject } from 'react';

import { getXOverflowWidth, getYOverflowHeight, parse2DMatrix } from '@react-hive/honey-utils';

import type { Nullable } from '../types';
import type { HoneyDragHandlers, HoneyDragOnMoveHandler } from './use-honey-drag';
import type { UseHoneyResizeHandler } from './use-honey-resize';
import { useHoneyDrag } from './use-honey-drag';
import { useHoneyResize } from './use-honey-resize';

type Axis = 'x' | 'y' | 'both';

interface ApplyAxisScrollParams {
  /**
   * Drag delta for the axis (deltaX or deltaY).
   */
  delta: number;
  /**
   * Current translate value for the axis.
   */
  currentTranslate: number;
  /**
   * Visible container size for the axis (width or height).
   */
  containerSize: number;
  /**
   * Overflow size for the axis.
   */
  overflowSize: number;
  /**
   * Overscroll window percentage.
   */
  overscrollPct: number;
}

/**
 * Calculates the next translate value for a single scroll axis
 * and determines whether movement is allowed within bounds.
 *
 * @returns The next translate value, or `null` if movement is not allowed.
 */
export const applyAxisScroll = ({
  delta,
  currentTranslate,
  containerSize,
  overflowSize,
  overscrollPct,
}: ApplyAxisScrollParams): Nullable<number> => {
  if (overflowSize <= 0 || delta === 0) {
    return null;
  }

  const threshold = containerSize * (overscrollPct / 100);
  const candidate = currentTranslate + delta;

  const min = -(overflowSize + threshold);
  const max = threshold;

  const isWithinBounds = (delta < 0 && candidate >= min) || (delta > 0 && candidate <= max);

  return isWithinBounds ? candidate : null;
};

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
  axis?: Axis;
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
  overscrollPct?: number;
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
  overscrollPct = 0,
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
        let shouldScroll = false;

        if (axis === 'x' || axis === 'both') {
          const next = applyAxisScroll({
            delta: deltaX,
            currentTranslate: translateX,
            containerSize: scrollableContainer.clientWidth,
            overflowSize: getXOverflowWidth(scrollableContainer),
            overscrollPct,
          });

          if (next !== null) {
            nextX = next;
            shouldScroll = true;
          }
        }

        if (axis === 'y' || axis === 'both') {
          const next = applyAxisScroll({
            delta: deltaY,
            currentTranslate: translateY,
            containerSize: scrollableContainer.clientHeight,
            overflowSize: getYOverflowHeight(scrollableContainer),
            overscrollPct,
          });

          if (next !== null) {
            nextY = next;
            shouldScroll = true;
          }
        }

        // Apply transform only when at least one axis was updated
        if (shouldScroll) {
          scrollableContainer.style.transform = `translate(${nextX}px, ${nextY}px)`;
        }

        return shouldScroll;
      },
    [overscrollPct],
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
