import { useCallback, useRef, useState } from 'react';
import { applyInertiaStep } from '@react-hive/honey-utils';

import type { HoneyRafOnFrameHandler } from './use-honey-raf-loop';
import { useHoneyRafLoop } from './use-honey-raf-loop';

/**
 * Configuration options for {@link useHoneyDecay}.
 */
export interface UseHoneyDecayOptions {
  /**
   * Initial numeric value from which inertial motion starts.
   *
   * This typically represents a translated position  (e.g. scroll offset or `translateX` value),
   * but may be any bounded numeric domain.
   */
  initialValue: number;
  /**
   * Lower bound for the value (inclusive).
   *
   * Movement beyond this boundary is not permitted.
   */
  min: number;
  /**
   * Upper bound for the value (inclusive).
   *
   * Movement beyond this boundary is not permitted.
   */
  max: number;
  /**
   * Exponential friction coefficient applied per millisecond.
   *
   * Controls how quickly velocity decays over time.
   *
   * Smaller values produce longer, floatier inertia;
   * larger values result in a quicker stop.
   *
   * @default 0.002
   */
  friction?: number;
  /**
   * Minimum absolute velocity below which inertia is considered complete.
   *
   * This prevents unnecessary micro-updates and jitter near rest.
   *
   * @default 0.01
   */
  minVelocityPxMs?: number;
}

/**
 * Public control API returned by {@link useHoneyDecay}.
 *
 * Exposes imperative controls for managing velocity-based inertial motion.
 */
export interface UseHoneyDecayApi {
  /**
   * Current value produced by the decay simulation.
   *
   * This value updates over time while inertia is active
   * and always remains within the configured bounds.
   */
  value: number;
  /**
   * Indicates whether inertial motion is currently active.
   */
  isRunning: boolean;
  /**
   * Starts inertial motion from the current value using
   * the provided initial velocity.
   *
   * The sign of the velocity determines a direction:
   * - Positive → movement toward the upper bound
   * - Negative → movement toward the lower bound
   *
   * @param velocityPxMs - Initial velocity expressed in pixels per millisecond (`px/ms`).
   */
  start: (velocityPxMs: number) => void;
  /**
   * Immediately stops inertial motion.
   */
  stop: () => void;
  /**
   * Immediately sets the value and cancels any active inertia.
   *
   * @param value - The value to apply immediately.
   */
  snapTo: (value: number) => void;
}

/**
 * A bounded, velocity-based inertia (decay) hook built on top of {@link useHoneyRafLoop} and {@link applyInertiaStep}.
 *
 * This hook models **momentum-driven motion** where:
 * - Motion starts with an initial velocity
 * - Velocity decays exponentially over time
 * - Movement is constrained by hard numeric bounds
 * - Inertia stops naturally when velocity becomes negligible
 *
 * Unlike spring-based motion, this hook has **no target value**.
 * Motion continues purely based on momentum until it decays
 * or is blocked by a boundary.
 *
 * ---
 *
 * ### Key characteristics
 * - Frame-rate independent (delta-time based)
 * - Deterministic and interruptible
 * - Direction-aware and bound-safe (no overshoot or jitter)
 * - Closely matches native scroll and drag inertia behavior
 *
 * ---
 *
 * ### Visibility behavior
 * This hook is a **simulation-based system**:
 * - Inertia automatically pauses when the document becomes hidden
 * - No time elapses while hidden
 * - Motion resumes only when explicitly restarted
 *
 * This behavior is inherited from {@link useHoneyRafLoop} and is intentional.
 *
 * ---
 *
 * ### Common use cases
 * - Scroll containers with momentum
 * - Drag-to-scroll interactions
 * - Carousels and sliders
 * - Timelines and scrubbers
 * - Kinetic panning and flinging
 *
 * ---
 *
 * @example
 * ```ts
 * const decay = useHoneyDecay({
 *   initialValue: 0,
 *   min: -maxOverflow,
 *   max: 0,
 * });
 *
 * const onRelease = (velocityPxMs: number) => {
 *   decay.start(velocityPxMs);
 * };
 *
 * return (
 *   <div style={{ transform: `translateX(${decay.value}px)` }} />
 * );
 * ```
 */
export const useHoneyDecay = ({
  initialValue,
  min,
  max,
  friction,
  minVelocityPxMs,
}: UseHoneyDecayOptions): UseHoneyDecayApi => {
  const [value, setValue] = useState(initialValue);

  const valueRef = useRef(initialValue);
  const velocityPxMsRef = useRef(0);

  const onFrameHandler = useCallback<HoneyRafOnFrameHandler>(
    (deltaTimeMs, frameContext) => {
      const result = applyInertiaStep({
        value: valueRef.current,
        velocityPxMs: velocityPxMsRef.current,
        min,
        max,
        deltaTimeMs,
        friction,
        minVelocityPxMs,
      });

      if (!result) {
        velocityPxMsRef.current = 0;

        frameContext.stop();
        return;
      }

      valueRef.current = result.value;
      velocityPxMsRef.current = result.velocityPxMs;

      setValue(result.value);
    },
    [min, max, friction, minVelocityPxMs],
  );

  const rafLoop = useHoneyRafLoop(onFrameHandler);

  const start = useCallback(
    (velocityPxMs: number) => {
      velocityPxMsRef.current = velocityPxMs;

      rafLoop.start();
    },
    [rafLoop.start],
  );

  const stop = useCallback(() => {
    velocityPxMsRef.current = 0;

    rafLoop.stop();
  }, [rafLoop.stop]);

  const snapTo = useCallback(
    (nextValue: number) => {
      velocityPxMsRef.current = 0;
      valueRef.current = nextValue;

      rafLoop.stop();
      setValue(nextValue);
    },
    [rafLoop.stop],
  );

  return {
    value,
    isRunning: rafLoop.isRunning,
    start,
    stop,
    snapTo,
  };
};
