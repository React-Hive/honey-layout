import type { RefObject } from 'react';
import { useEffect } from 'react';

import type { Nullable } from '../types';
import { calculateEuclideanDistance, calculateMovingSpeed } from '../utils';

/**
 * The handler that is triggered when dragging starts.
 *
 * - The handler can return `false` to prevent the drag from starting.
 * - If the handler returns `void` or `true`, the drag will proceed.
 */
export type HoneyDragOnStartHandler<Element extends HTMLElement> = (
  draggableElement: Element,
) => void | boolean;

/**
 * Context provided to the move handler, containing information about the drag's movement.
 */
type HoneyDragMoveContext = {
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
};

/**
 * The handler that is triggered during dragging.
 * It accepts the draggable element and returns a function that is called on every move event with the context as its argument.
 * If this function returns `false`, the drag is stopped immediately.
 */
export type HoneyDragOnMoveHandler<Element extends HTMLElement> = (
  draggableElement: Element,
) => (context: HoneyDragMoveContext) => void | false;

/**
 * Context provided to the end handler, containing information about the drag's end state.
 */
type HoneyDragEndContext = {
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
};

/**
 * The handler that is triggered when dragging ends.
 * It accepts the end context and the draggable element.
 */
export type HoneyDragOnEndHandler<Element extends HTMLElement> = (
  context: HoneyDragEndContext,
  draggableElement: Element,
) => void;

/**
 * Object containing the handlers for various stages of the drag operation.
 * These handlers can be customized to manage the behavior of the drag process.
 */
export type HoneyDragHandlers<Element extends HTMLElement> = {
  /**
   * Optional handler triggered when the drag operation starts.
   * This can be used to capture the initial state or perform setup actions.
   */
  onStartDrag?: HoneyDragOnStartHandler<Element>;
  /**
   * Required handler triggered continuously during the drag operation.
   * This handles updating the drag state and typically tracks the element's movement.
   */
  onMoveDrag: HoneyDragOnMoveHandler<Element>;
  /**
   * Optional handler triggered when the drag operation ends.
   * This can be used for cleanup or finalizing the state after the drag ends.
   */
  onEndDrag?: HoneyDragOnEndHandler<Element>;
};

/**
 * Options passed to the `useHoneyDrag` hook.
 */
export type HoneyDragOptions = {
  /**
   * Determines whether the drag functionality is enabled or not.
   *
   * @default true
   */
  isEnabled?: boolean;
};

/**
 * A hook that provides touch and mouse-based dragging functionality for an element.
 * It tracks the movement of the element during the drag process and exposes handlers for each stage of the drag operation.
 *
 * @template Element - The type of the HTML element that is being dragged.
 *
 * @param {RefObject<Nullable<Element>>} draggableElementRef - A reference to the element that can be dragged.
 * @param {HoneyDragHandlers<Element>} handlers - The drag event handlers for different stages of the drag operation (start, move, end).
 * @param {HoneyDragOptions} options - Configuration options.
 */
export const useHoneyDrag = <Element extends HTMLElement>(
  draggableElementRef: RefObject<Nullable<Element>>,
  { onMoveDrag, onStartDrag, onEndDrag }: HoneyDragHandlers<Element>,
  { isEnabled = true }: HoneyDragOptions = {},
) => {
  useEffect(() => {
    const draggableElement = draggableElementRef.current;

    if (!isEnabled || !draggableElement) {
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

    const startDrag = (clientX: number, clientY: number) => {
      if (onStartDrag) {
        if (onStartDrag(draggableElement) === false) {
          // Exit if the `onStart` handler returns false, preventing the drag.
          return;
        }
      }

      isDragging = true;

      startX = clientX;
      startY = clientY;
      lastX = clientX;
      lastY = clientY;

      // Record the start time for speed calculations.
      startTime = Date.now();
    };

    const stopDrag = () => {
      if (!isDragging) {
        return;
      }

      isDragging = false;

      if (onEndDrag) {
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

        onEndDrag(endContext, draggableElement);
      }
    };

    const releaseDrag = () => {
      stopDrag();

      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', releaseDrag);
    };

    const moveHandler = (clientX: number, clientY: number) => {
      if (!isDragging) {
        return;
      }

      const moveContext: HoneyDragMoveContext = {
        get deltaX() {
          return clientX - lastX;
        },
        get deltaY() {
          return clientY - lastY;
        },
        get distanceX() {
          return clientX - startX;
        },
        get distanceY() {
          return clientY - startY;
        },
        get euclideanDistance() {
          return calculateEuclideanDistance(startX, startY, clientX, clientY);
        },
      };

      if (onMove(moveContext) === false) {
        lastX = clientX;
        lastY = clientY;

        releaseDrag();
        return;
      }

      lastX = clientX;
      lastY = clientY;
    };

    const touchStartHandler = (e: TouchEvent) => {
      e.stopPropagation();

      const touch = e.touches[0];

      startDrag(touch.clientX, touch.clientY);
    };

    const touchMoveHandler = (e: TouchEvent) => {
      const touch = e.touches[0];

      moveHandler(touch.clientX, touch.clientY);
    };

    const touchCancelHandler = () => {
      isDragging = false;
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      moveHandler(e.clientX, e.clientY);
    };

    const mouseDownHandler = (e: MouseEvent) => {
      e.stopPropagation();

      startDrag(e.clientX, e.clientY);

      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', releaseDrag);
    };

    draggableElement.addEventListener('touchstart', touchStartHandler, {
      passive: true,
    });
    draggableElement.addEventListener('touchmove', touchMoveHandler, {
      passive: true,
    });
    draggableElement.addEventListener('touchend', stopDrag);
    draggableElement.addEventListener('touchcancel', touchCancelHandler);
    draggableElement.addEventListener('mousedown', mouseDownHandler);

    return () => {
      draggableElement.removeEventListener('touchstart', touchStartHandler);
      draggableElement.removeEventListener('touchmove', touchMoveHandler);
      draggableElement.removeEventListener('touchend', stopDrag);
      draggableElement.removeEventListener('touchcancel', touchCancelHandler);
      draggableElement.removeEventListener('mousedown', mouseDownHandler);
    };
  }, [isEnabled, onStartDrag, onMoveDrag, onEndDrag]);
};
