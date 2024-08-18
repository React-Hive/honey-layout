import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

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
 *
 * Note:
 * - `deltaX` and `deltaY` represent the movement since the last frame.
 * - `distanceX` and `distanceY` represent the total movement from the starting position.
 * - `euclideanDistance` is the straight-line distance from the start position to the current position.
 */
type HoneyDragMoveContext = {
  deltaX: number;
  deltaY: number;
  distanceX: number;
  distanceY: number;
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
 *
 * Note:
 * - `deltaX` and `deltaY` represent the total movement from the start position to the end position.
 * - `movingSpeedX` and `movingSpeedY` represent the speed of movement in the X and Y directions, respectively.
 */
type HoneyDragEndContext = {
  deltaX: number;
  deltaY: number;
  movingSpeedX: number;
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
 * The set of handlers that can be passed to the hook.
 *
 * Note:
 * - `onStartDrag` is optional and handles the start of the drag.
 * - `onMoveDrag` is required and handles the drag movement.
 * - `onEndDrag` is optional and handles the end of the drag.
 */
export type HoneyDragHandlers<Element extends HTMLElement> = {
  onStartDrag?: HoneyDragOnStartHandler<Element>;
  onMoveDrag: HoneyDragOnMoveHandler<Element>;
  onEndDrag?: HoneyDragOnEndHandler<Element>;
};

/**
 * A hook that provides touch and mouse-based dragging functionality for an element.
 * It tracks touch and mouse events, calculates dragging speed and distances during the drag,
 * and exposes `onStart`, `onMove`, and `onEnd` callbacks to handle various stages of dragging.
 *
 * @param {MutableRefObject<Element>} draggableElementRef - A `ref` to the element that should be made draggable.
 * @param {HoneyDragHandlers<Element>} handlers - An object containing the callback functions for different dragging stages.
 */
export const useHoneyDrag = <Element extends HTMLElement>(
  draggableElementRef: MutableRefObject<Nullable<Element>>,
  { onMoveDrag, onStartDrag, onEndDrag }: HoneyDragHandlers<Element>,
) => {
  useEffect(() => {
    const draggableElement = draggableElementRef.current;
    if (!draggableElement) {
      return;
    }

    const onMove = onMoveDrag(draggableElement);

    let isDragging = false;

    let startPositionX = 0;
    let startPositionY = 0;
    let lastPositionX = 0;
    let lastPositionY = 0;

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

      startPositionX = clientX;
      startPositionY = clientY;
      lastPositionX = clientX;
      lastPositionY = clientY;

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

        const deltaX = lastPositionX - startPositionX;
        const deltaY = lastPositionY - startPositionY;

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
          return clientX - lastPositionX;
        },
        get deltaY() {
          return clientY - lastPositionY;
        },
        get distanceX() {
          return clientX - startPositionX;
        },
        get distanceY() {
          return clientY - startPositionY;
        },
        get euclideanDistance() {
          return calculateEuclideanDistance(startPositionX, startPositionY, clientX, clientY);
        },
      };

      if (onMove(moveContext) === false) {
        lastPositionX = clientX;
        lastPositionY = clientY;

        releaseDrag();
        return;
      }

      lastPositionX = clientX;
      lastPositionY = clientY;
    };

    const touchStartHandler = (e: TouchEvent) => {
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
  }, [onStartDrag, onMoveDrag, onEndDrag, draggableElementRef]);
};
