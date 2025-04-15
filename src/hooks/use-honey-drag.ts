import { useEffect } from 'react';
import type { RefObject } from 'react';

import { calculateEuclideanDistance, calculateMovingSpeed } from '../utils';
import type { Nullable } from '../types';

/**
 * Handler triggered when a drag operation starts.
 *
 * @template Element - The type of the draggable element (must extend HTMLElement).
 *
 * @param draggableElement - The element being dragged.
 *
 * @returns A Promise that resolves to a boolean:
 *          - `false` to cancel the drag.
 *          - `true` to proceed with the drag.
 */
export type HoneyDragOnStartHandler<Element extends HTMLElement> = (
  draggableElement: Element,
) => Promise<boolean>;

/**
 * Context provided to the move handler, containing information about the drag's movement.
 */
export interface HoneyDragMoveContext {
  /**
   * The horizontal distance has moved since the last frame.
   */
  deltaX: number;
  /**
   * The vertical distance has moved since the last frame.
   */
  deltaY: number;
  /**
   * The total horizontal distance from the starting position to the current position.
   */
  distanceX: number;
  /**
   * The total vertical distance from the starting position to the current position.
   */
  distanceY: number;
  /**
   * The straight-line distance from the starting position to the current position.
   */
  euclideanDistance: number;
}

/**
 * Handler triggered during a drag operation.
 *
 * @template Element - The type of the draggable element (must extend HTMLElement).
 *
 * Behavior:
 * - The handler receives the draggable element and returns a function that is called on every move event.
 * - If the returned function resolves to `false`, the drag operation stops immediately.
 *
 * This allows for real-time handling of drag events and asynchronous conditions during dragging.
 *
 * @param draggableElement - The element being dragged.
 *
 * @returns A function that handles move events and returns a Promise that resolves to `true`
 *          to continue dragging, or `false` to stop it.
 */
export type HoneyDragOnMoveHandler<Element extends HTMLElement> = (
  draggableElement: Element,
) => (context: HoneyDragMoveContext) => Promise<boolean>;

/**
 * Context provided to the end handler, containing information about the drag's end state.
 */
interface HoneyDragEndContext {
  /**
   * The total horizontal movement from the starting position to the ending position.
   */
  deltaX: number;
  /**
   * The total vertical movement from the starting position to the ending position.
   */
  deltaY: number;
  /**
   * The speed of movement in the horizontal direction (X axis).
   */
  movingSpeedX: number;
  /**
   * The speed of movement in the vertical direction (Y axis).
   */
  movingSpeedY: number;
}

/**
 * Handler triggered when a drag operation ends.
 *
 * @template Element - The type of the draggable element (must extend HTMLElement).
 *
 * @param context - The context containing details about the drag operation at its end.
 *                  Provides information such as the final position and drag result.
 * @param draggableElement - The element that was being dragged.
 *
 * @returns A Promise that resolves when the end handler completes its operations.
 */
export type HoneyDragOnEndHandler<Element extends HTMLElement> = (
  context: HoneyDragEndContext,
  draggableElement: Element,
) => Promise<void>;

/**
 * A set of handlers that define the behavior of the drag operation at different stages.
 * These handlers are customizable for managing drag initialization, movement, and completion.
 */
export interface HoneyDragHandlers<Element extends HTMLElement> {
  /**
   * Optional handler triggered when the drag operation starts.
   * This is useful for capturing the initial state or performing any setup actions before the drag starts.
   *
   * @param element - The element being dragged.
   *
   * @returns A boolean or Promise resolving to a boolean indicating if the drag should proceed.
   */
  onStartDrag?: HoneyDragOnStartHandler<Element>;
  /**
   * Required handler triggered continuously during the drag operation.
   * This handler is responsible for updating the drag state and typically tracks the element's movement.
   *
   * @param element - The element being dragged.
   *
   * @returns A boolean or Promise resolving to a boolean indicating whether the drag should continue.
   */
  onMoveDrag: HoneyDragOnMoveHandler<Element>;
  /**
   * Optional handler triggered when the drag operation ends.
   * This is commonly used for cleanup or finalizing the drag process.
   *
   * @param context - Contains information about the drag operation, such as distance and speed.
   * @param element - The element being dragged.
   *
   * @returns A Promise.
   */
  onEndDrag?: HoneyDragOnEndHandler<Element>;
}

/**
 * Configuration options for the drag functionality.
 * These options control the behavior of the drag hook and modify how the drag events are handled.
 */
export interface HoneyDragOptions<Element extends HTMLElement> extends HoneyDragHandlers<Element> {
  /**
   * Controls whether the `onEndDrag` handler is skipped when the drag operation is forcibly stopped.
   * This can be useful when dragging is interrupted or terminated early due to movement restrictions.
   *
   * @default false
   */
  skipOnEndDragWhenStopped?: boolean;
  /**
   * Determines if the drag functionality is enabled or disabled.
   *
   * @default true
   */
  enabled?: boolean;
}

/**
 * A hook that provides touch and mouse-based dragging functionality for an element.
 * It enables the ability to drag an element on both mouse and touch interfaces,
 * with customizable handlers for different stages of the drag.
 *
 * @template Element - The type of the HTML element that is being dragged.
 *
 * @param draggableElementRef - A reference to the element that can be dragged.
 * @param options - Handlers for different stages of the drag operation and configuration options
 *                  for controlling drag behavior.
 *
 * @returns A cleanup function to remove event listeners when the component is unmounted.
 */
export const useHoneyDrag = <Element extends HTMLElement>(
  draggableElementRef: RefObject<Nullable<Element>>,
  {
    skipOnEndDragWhenStopped = false,
    enabled = true,
    onMoveDrag,
    onStartDrag,
    onEndDrag,
  }: HoneyDragOptions<Element>,
) => {
  useEffect(() => {
    const draggableElement = draggableElementRef.current;

    if (!enabled || !draggableElement) {
      return;
    }

    const onMove = onMoveDrag(draggableElement);

    let isDragging = false;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;

    // Store the start time of the drag to calculate speed later.
    let startTime = 0;

    const startDrag = async (clientX: number, clientY: number) => {
      if (onStartDrag && !(await onStartDrag(draggableElement))) {
        // Exit when `onStartDrag` returns false, preventing the dragging
        return;
      }

      isDragging = true;

      startX = clientX;
      startY = clientY;
      lastX = clientX;
      lastY = clientY;

      // Record the start time for speed calculations.
      startTime = Date.now();
    };

    const stopDrag = async (isTriggerOnEndDrag: boolean) => {
      if (!isDragging) {
        return;
      }

      isDragging = false;

      if (isTriggerOnEndDrag && onEndDrag) {
        // Calculate the elapsed time for speed calculations.
        const elapsedTime = Date.now() - startTime;

        const deltaX = lastX - startX;
        const deltaY = lastY - startY;

        const endContext: HoneyDragEndContext = {
          deltaX,
          deltaY,
          get movingSpeedX() {
            return calculateMovingSpeed(deltaX, elapsedTime);
          },
          get movingSpeedY() {
            return calculateMovingSpeed(deltaY, elapsedTime);
          },
        };

        await onEndDrag(endContext, draggableElement);
      }
    };

    const releaseDrag = async (isTriggerOnEndDrag: boolean) => {
      await stopDrag(isTriggerOnEndDrag);

      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);

      window.removeEventListener('touchmove', touchMoveHandler);
      window.removeEventListener('touchend', touchEndHandler);
      window.removeEventListener('touchcancel', touchCancelHandler);
    };

    const mouseUpHandler = async () => {
      await releaseDrag(true);
    };

    const moveHandler = async (clientX: number, clientY: number) => {
      if (!isDragging) {
        return;
      }

      const moveContext: HoneyDragMoveContext = {
        deltaX: clientX - lastX,
        deltaY: clientY - lastY,
        distanceX: clientX - startX,
        distanceY: clientY - startY,
        euclideanDistance: calculateEuclideanDistance(startX, startY, clientX, clientY),
      };

      if (!(await onMove(moveContext))) {
        lastX = clientX;
        lastY = clientY;

        await releaseDrag(!skipOnEndDragWhenStopped);
        return;
      }

      lastX = clientX;
      lastY = clientY;
    };

    const mouseMoveHandler = async (e: MouseEvent) => {
      await moveHandler(e.clientX, e.clientY);
    };

    const touchMoveHandler = async (e: TouchEvent) => {
      const touch = e.touches[0];

      await moveHandler(touch.clientX, touch.clientY);
    };

    const touchEndHandler = async () => {
      await releaseDrag(true);
    };

    const touchCancelHandler = async () => {
      await releaseDrag(true);
    };

    const touchStartHandler = async (e: TouchEvent) => {
      e.stopPropagation();

      const touch = e.touches[0];

      await startDrag(touch.clientX, touch.clientY);

      window.addEventListener('touchmove', touchMoveHandler, {
        passive: true,
      });
      window.addEventListener('touchend', touchEndHandler);
      window.addEventListener('touchcancel', touchCancelHandler);
    };

    const mouseDownHandler = async (e: MouseEvent) => {
      e.stopPropagation();

      await startDrag(e.clientX, e.clientY);

      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    };

    draggableElement.addEventListener('mousedown', mouseDownHandler);
    draggableElement.addEventListener('touchstart', touchStartHandler, {
      passive: true,
    });

    return () => {
      draggableElement.removeEventListener('mousedown', mouseDownHandler);
      draggableElement.removeEventListener('touchstart', touchStartHandler);
    };
  }, [enabled, onStartDrag, onMoveDrag, onEndDrag]);
};
