import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

import { Axis } from '@react-hive/honey-utils';
import {
  resolveBoundedDelta,
  getXOverflowWidth,
  getYOverflowHeight,
  parse2DMatrix,
  resolveAxisDelta,
} from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type {
  HoneyDragHandlers,
  HoneyDragOnEndHandler,
  HoneyDragOnMoveHandler,
  HoneyDragOnStartHandler,
} from './use-honey-drag';
import type { UseHoneyResizeHandler } from './use-honey-resize';
import { useHoneyDrag } from './use-honey-drag';
import { useHoneyResize } from './use-honey-resize';

interface ResolveAxisTranslateOptions {
  /**
   * Drag delta for the axis (deltaX or deltaY).
   */
  delta: number;
  /**
   * Current translate value for the axis.
   */
  translate: number;
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

export const resolveAxisTranslate = ({
  delta,
  translate,
  containerSize,
  overflowSize,
  overscrollPct,
}: ResolveAxisTranslateOptions): Nullable<number> => {
  if (overflowSize <= 0) {
    return null;
  }

  const threshold = containerSize * (overscrollPct / 100);

  return resolveBoundedDelta({
    delta,
    value: translate,
    min: -(overflowSize + threshold),
    max: threshold,
  });
};

interface ApplyScrollDeltaOptions {
  axis: Axis;
  container: HTMLElement;
  deltaX: number;
  deltaY: number;
  overscrollPct: number;
}

const applyScrollDelta = ({
  axis,
  container,
  deltaX,
  deltaY,
  overscrollPct,
}: ApplyScrollDeltaOptions): boolean => {
  const { translateX, translateY } = parse2DMatrix(container);

  let nextX = translateX;
  let nextY = translateY;
  let shouldScroll = false;

  if (axis === 'x' || axis === 'both') {
    const next = resolveAxisTranslate({
      delta: deltaX,
      translate: translateX,
      containerSize: container.clientWidth,
      overflowSize: getXOverflowWidth(container),
      overscrollPct,
    });

    if (next !== null) {
      nextX = next;
      shouldScroll = true;
    }
  }

  if (axis === 'y' || axis === 'both') {
    const next = resolveAxisTranslate({
      delta: deltaY,
      translate: translateY,
      containerSize: container.clientHeight,
      overflowSize: getYOverflowHeight(container),
      overscrollPct,
    });

    if (next !== null) {
      nextY = next;
      shouldScroll = true;
    }
  }

  if (shouldScroll) {
    container.style.transform = `translate(${nextX}px, ${nextY}px)`;
  }

  return shouldScroll;
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
  /**
   * Enables synthetic scrolling driven by pointer-based scroll input,
   * such as mouse wheels and trackpads.
   *
   * When enabled, scroll input is intercepted and converted into bounded
   * translation using the same logic as drag gestures.
   *
   * When disabled, native scrolling behavior is preserved and no scroll
   * input is handled by this hook.
   *
   * @default true
   */
  enablePointerScroll?: boolean;
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
  enablePointerScroll = true,
}: UseHoneySyntheticScrollOptions<Element> = {}): RefObject<Nullable<Element>> => {
  const containerRef = useRef<Nullable<Element>>(null);

  const handleOnStartDrag = useCallback<HoneyDragOnStartHandler<Element>>(
    async (...args) => {
      return onStartDrag?.(...args) ?? true;
    },
    [onStartDrag],
  );

  /**
   * Handles drag movement and applies clamped translation along the enabled axis or axes.
   *
   * For each axis:
   * - Skip processing if there is no overflow.
   * - Compute the candidate translate value from the drag delta.
   * - Clamp movement within calculated min / max bounds.
   */
  const handleOnMoveDrag = useCallback<HoneyDragOnMoveHandler<Element>>(
    container =>
      async ({ deltaX, deltaY }) => {
        return applyScrollDelta({
          container,
          deltaX,
          deltaY,
          axis,
          overscrollPct,
        });
      },
    [axis, overscrollPct],
  );

  const handleOnEndDrag = useCallback<HoneyDragOnEndHandler<Element>>(
    async (...args) => {
      onEndDrag?.(...args);
    },
    [axis, overscrollPct, onEndDrag],
  );

  useHoneyDrag(containerRef, {
    onStartDrag: handleOnStartDrag,
    onMoveDrag: handleOnMoveDrag,
    onEndDrag: handleOnEndDrag,
  });

  const resizeHandler = useCallback<UseHoneyResizeHandler>(() => {
    const container = containerRef.current;
    if (container) {
      container.style.removeProperty('transform');
    }
  }, []);

  useHoneyResize(resizeHandler, {
    enabled: resetOnResize,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.style.overscrollBehavior = 'contain';
    container.style.touchAction = 'none';

    const handleOnWheel = (event: WheelEvent) => {
      const { deltaX, deltaY } = resolveAxisDelta(
        {
          deltaX: event.deltaX,
          deltaY: event.deltaY,
        },
        axis,
      );

      const didScroll = applyScrollDelta({
        container,
        deltaX,
        deltaY,
        axis,
        overscrollPct,
      });

      if (didScroll) {
        event.preventDefault();
      }
    };

    if (enablePointerScroll) {
      container.addEventListener('wheel', handleOnWheel, { passive: false });
    }

    return () => {
      container.style.removeProperty('overscroll-behavior');
      container.style.removeProperty('touch-action');

      if (enablePointerScroll) {
        container.removeEventListener('wheel', handleOnWheel);
      }
    };
  }, [enablePointerScroll]);

  return containerRef;
};
