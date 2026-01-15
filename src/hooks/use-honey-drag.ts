import { useEffect } from 'react';
import type { RefObject } from 'react';

import type { Nullable } from '../types';

/**
 * Invoked when a drag gesture is about to start.
 *
 * This handler is called on the initial pointer-down interaction
 * (mouse or touch) **before** drag tracking begins.
 *
 * It can be used to:
 * - Conditionally allow or block dragging
 * - Capture initial external state
 * - Cancel dragging based on application logic
 *
 * @template Element - The draggable element type.
 *
 * @param draggableElement - The element that will be dragged.
 * @param e - The initiating pointer event.
 *
 * @returns A promise resolving to:
 * - `true` to allow the drag to begin
 * - `false` to cancel the drag
 */
export type HoneyDragOnStartHandler<Element extends HTMLElement> = (
  draggableElement: Element,
  e: MouseEvent | TouchEvent,
) => Promise<boolean>;

/**
 * Context describing pointer movement during an active drag gesture.
 *
 * All values are expressed in **pixels** and are relative
 * to the drag start or previous frame as noted.
 */
export interface HoneyDragMoveContext {
  /**
   * Horizontal delta since the previous move event.
   *
   * Positive values indicate movement to the right.
   */
  deltaX: number;
  /**
   * Vertical delta since the previous move event.
   *
   * Positive values indicate movement downward.
   */
  deltaY: number;
  /**
   * Total horizontal displacement from the drag start position.
   */
  distanceX: number;
  /**
   * Total vertical displacement from the drag start position.
   */
  distanceY: number;
}

/**
 * Handler invoked continuously while a drag gesture is active.
 *
 * This handler:
 * - Is created once per drag start
 * - Receives incremental movement data on each pointer move
 * - Can synchronously or asynchronously decide whether dragging continues
 *
 * Returning `false` from the move callback immediately terminates the drag.
 *
 * @template Element - The draggable element type.
 *
 * @param draggableElement - The element being dragged.
 *
 * @returns A function invoked on every pointer move, receiving
 *          {@link HoneyDragMoveContext}, and resolving to:
 *          - `true` to continue dragging
 *          - `false` to stop dragging immediately
 */
export type HoneyDragOnMoveHandler<Element extends HTMLElement> = (
  draggableElement: Element,
) => (context: HoneyDragMoveContext) => Promise<boolean>;

/**
 * Context describing the final state of a completed drag gesture.
 *
 * This context exposes **release velocity**, which is suitable for
 * inertia, momentum, or decay-based motion systems.
 */
interface HoneyDragEndContext {
  /**
   * Total horizontal displacement from drag start to release.
   */
  deltaX: number;
  /**
   * Total vertical displacement from drag start to release.
   */
  deltaY: number;
  /**
   * Horizontal release velocity in pixels per millisecond (`px/ms`).
   *
   * This value represents the **instantaneous velocity at release**
   * and is suitable for inertia or momentum-based motion.
   */
  velocityXPxMs: number;
  /**
   * Vertical release velocity in pixels per millisecond (`px/ms`).
   *
   * This value represents the **instantaneous velocity at release**
   * and is suitable for inertia or momentum-based motion.
   */
  velocityYPxMs: number;
}

/**
 * Invoked when a drag gesture ends.
 *
 * This handler is called when:
 * - The pointer is released
 * - The drag is programmatically terminated (unless explicitly skipped)
 *
 * It provides final displacement and **release velocity**, making it
 * ideal for triggering inertia or decay animations.
 *
 * @template Element - The draggable element type.
 *
 * @param context - Final drag metrics, including release velocity.
 * @param draggableElement - The element that was dragged.
 * @param e - The pointer event that finished the drag.
 *
 * @returns A promise that resolves when cleanup or follow-up logic completes.
 */
export type HoneyDragOnEndHandler<Element extends HTMLElement> = (
  context: HoneyDragEndContext,
  draggableElement: Element,
  e: MouseEvent | TouchEvent,
) => Promise<void>;

/**
 * Collection of handlers controlling the lifecycle of a drag gesture.
 *
 * Together, these handlers define:
 * - Whether dragging is allowed
 * - How movement is handled
 * - What happens when dragging ends
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
 * Configuration options controlling drag behavior.
 *
 * These options affect lifecycle handling and enable/disable logic,
 * but do not influence movement physics directly.
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
 * Enables high-precision mouse and touch dragging for an element.
 *
 * This hook:
 * - Tracks pointer movement using `performance.now()`
 * - Computes **instantaneous release velocity** (px/ms)
 * - Emits deterministic drag lifecycle events
 * - Supports both mouse and touch input
 *
 * Architectural notes:
 * - Velocity is computed **during movement**, not at drag end
 * - Release velocity is suitable for inertia / decay systems
 * - No layout reads or writes are performed internally
 *
 * @template Element - The draggable HTML element type.
 *
 * @param draggableElementRef - Ref pointing to the draggable element.
 * @param options - Drag lifecycle handlers and configuration flags.
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
    let lastMoveTimeMs = 0;
    let velocityXPxMs = 0;
    let velocityYPxMs = 0;

    const startDrag = async (clientX: number, clientY: number, e: MouseEvent | TouchEvent) => {
      if (onStartDrag && !(await onStartDrag(draggableElement, e))) {
        // Exit when `onStartDrag` returns false, preventing the dragging
        return;
      }

      lastMoveTimeMs = performance.now();

      isDragging = true;

      startX = clientX;
      startY = clientY;
      lastX = clientX;
      lastY = clientY;

      velocityXPxMs = 0;
      velocityYPxMs = 0;
    };

    const stopDrag = async (isTriggerOnEndDrag: boolean, e: MouseEvent | TouchEvent) => {
      if (!isDragging) {
        return;
      }

      isDragging = false;

      if (isTriggerOnEndDrag && onEndDrag) {
        const deltaX = lastX - startX;
        const deltaY = lastY - startY;

        const endContext: HoneyDragEndContext = {
          deltaX,
          deltaY,
          velocityXPxMs,
          velocityYPxMs,
        };

        await onEndDrag(endContext, draggableElement, e);
      }
    };

    const releaseDrag = async (isTriggerOnEndDrag: boolean, e: MouseEvent | TouchEvent) => {
      await stopDrag(isTriggerOnEndDrag, e);

      window.removeEventListener('mousemove', mouseMoveHandler, { capture: true });
      window.removeEventListener('mouseup', mouseUpHandler, { capture: true });

      window.removeEventListener('touchmove', touchMoveHandler, { capture: true });
      window.removeEventListener('touchend', touchEndHandler, { capture: true });
      window.removeEventListener('touchcancel', touchCancelHandler, { capture: true });
    };

    const mouseUpHandler = async (e: MouseEvent) => {
      await releaseDrag(true, e);
    };

    const moveHandler = async (clientX: number, clientY: number, e: MouseEvent | TouchEvent) => {
      if (!isDragging) {
        return;
      }

      const nowMs = performance.now();
      const deltaTimeMs = nowMs - lastMoveTimeMs;

      const deltaX = clientX - lastX;
      const deltaY = clientY - lastY;

      if (deltaTimeMs > 0) {
        velocityXPxMs = deltaX / deltaTimeMs;
        velocityYPxMs = deltaY / deltaTimeMs;
      }

      const distanceX = clientX - startX;
      const distanceY = clientY - startY;

      const isContinue = await onMove({
        deltaX,
        deltaY,
        distanceX,
        distanceY,
      });

      lastX = clientX;
      lastY = clientY;
      lastMoveTimeMs = nowMs;

      if (!isContinue) {
        await releaseDrag(!skipOnEndDragWhenStopped, e);
      }
    };

    const mouseMoveHandler = async (e: MouseEvent) => {
      await moveHandler(e.clientX, e.clientY, e);
    };

    const touchMoveHandler = async (e: TouchEvent) => {
      const touch = e.touches[0];

      await moveHandler(touch.clientX, touch.clientY, e);
    };

    const touchEndHandler = async (e: TouchEvent) => {
      await releaseDrag(true, e);
    };

    const touchCancelHandler = async (e: TouchEvent) => {
      await releaseDrag(true, e);
    };

    const touchStartHandler = async (e: TouchEvent) => {
      e.stopPropagation();

      const touch = e.touches[0];

      await startDrag(touch.clientX, touch.clientY, e);

      window.addEventListener('touchmove', touchMoveHandler, {
        passive: true,
        capture: true,
      });
      window.addEventListener('touchend', touchEndHandler, { capture: true });
      window.addEventListener('touchcancel', touchCancelHandler, { capture: true });
    };

    const mouseDownHandler = async (e: MouseEvent) => {
      e.stopPropagation();

      await startDrag(e.clientX, e.clientY, e);

      window.addEventListener('mousemove', mouseMoveHandler, { capture: true });
      window.addEventListener('mouseup', mouseUpHandler, { capture: true });
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
