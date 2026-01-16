import { useCallback, useRef, useState } from 'react';
import type { InertiaOptions } from '@react-hive/honey-utils';
import { applyInertiaStep } from '@react-hive/honey-utils';

import type { HoneyRafFrameHandler } from '~/hooks';
import { useHoneyLatest, useHoneyRafLoop } from '~/hooks';

/**
 * Configuration options for {@link useHoneyDecay}.
 */
export interface UseHoneyDecayOptions extends Pick<
  InertiaOptions,
  'friction' | 'minVelocityPxMs' | 'emaAlpha'
> {
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
   * Optional callback invoked exactly once when inertial motion terminates.
   *
   * Triggered when inertia ends due to:
   * - velocity decaying below `minVelocityPxMs`
   * - movement being blocked by bounds
   * - an explicit call to `stop()`
   *
   * Not invoked if inertia was never started.
   */
  onStop?: () => void;
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
   * Updates the hard bounds used by the decay simulation.
   *
   * This method is safe to call **at any time**, including while inertia is actively running.
   *
   * ### Behavior
   * - If the current value lies **within** the new bounds:
   *   - bounds are updated
   *   - inertia (if running) continues uninterrupted
   *
   * - If the current value lies **outside** the new bounds:
   *   - the value is immediately clamped to the nearest boundary
   *   - internal velocity is reset to `0`
   *   - any active inertia is **terminated immediately**
   *   - `onStop` is invoked exactly once (if inertia was active)
   *
   * This deterministic behavior mirrors native scroll engines and ensures:
   * - no overshoot
   * - no extra inertia frames
   * - consistent `onStop` semantics
   *
   * ### Intended usage
   * - Responding to layout or content changes
   * - Handling resize / orientation changes
   * - Updating overscroll or overflow limits dynamically
   *
   * ⚠️ This method should **not** be called from inside the RAF frame handler.
   *
   * @param min - New lower bound (inclusive)
   * @param max - New upper bound (inclusive)
   */
  setBounds: (min: number, max: number) => void;
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
   * Immediately sets the value and starts inertial motion from that value in a single atomic operation.
   *
   * This is the preferred way to hand off from a gesture (e.g. drag end) to inertia, as it:
   * - avoids transient intermediate states
   * - guarantees correct value/velocity ordering
   * - ensures `onStop` semantics remain consistent
   *
   * @param value - Starting value for the inertia simulation
   * @param velocityPxMs - Initial velocity in pixels per millisecond (`px/ms`)
   */
  startFrom: (value: number, velocityPxMs: number) => void;
  /**
   * Immediately stops inertial motion.
   *
   * If inertia is currently active, this will:
   * - cancel the RAF loop
   * - reset internal velocity
   * - invoke `onStop` exactly once
   */
  stop: () => void;
}

/**
 * A bounded, velocity-based inertia (decay) hook built on top
 * of {@link useHoneyRafLoop} and {@link applyInertiaStep}.
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
  friction = 0.002,
  minVelocityPxMs = 0.01,
  emaAlpha = 0.2,
  onStop,
}: UseHoneyDecayOptions): UseHoneyDecayApi => {
  const [value, setValue] = useState(initialValue);

  const valueRef = useRef(initialValue);
  const velocityPxMsRef = useRef(0);
  const hasActiveInertiaRef = useRef(false);

  const minRef = useRef(min);
  const maxRef = useRef(max);

  const onStopRef = useHoneyLatest(onStop);

  const frameHandler = useCallback<HoneyRafFrameHandler>(
    (deltaTimeMs, frameContext) => {
      // Ignore the first RAF tick
      if (deltaTimeMs === 0) {
        return;
      }

      const result = applyInertiaStep({
        value: valueRef.current,
        velocityPxMs: velocityPxMsRef.current,
        min: minRef.current,
        max: maxRef.current,
        deltaTimeMs,
        friction,
        minVelocityPxMs,
        emaAlpha,
      });

      if (result === null) {
        velocityPxMsRef.current = 0;

        if (hasActiveInertiaRef.current) {
          hasActiveInertiaRef.current = false;

          onStopRef.current?.();
        }

        frameContext.stop();
        return;
      }

      hasActiveInertiaRef.current = true;

      valueRef.current = result.value;
      velocityPxMsRef.current = result.velocityPxMs;

      setValue(result.value);
    },
    [friction, minVelocityPxMs, emaAlpha],
  );

  const rafLoop = useHoneyRafLoop(frameHandler);

  const setBounds = useCallback(
    (nextMin: number, nextMax: number) => {
      minRef.current = nextMin;
      maxRef.current = nextMax;

      const currentValue = valueRef.current;

      if (currentValue < nextMin || currentValue > nextMax) {
        const nextValue = Math.min(Math.max(currentValue, nextMin), nextMax);

        valueRef.current = nextValue;
        velocityPxMsRef.current = 0;

        setValue(nextValue);

        if (hasActiveInertiaRef.current) {
          hasActiveInertiaRef.current = false;

          onStopRef.current?.();
        }

        rafLoop.stop();
      }
    },
    [rafLoop.stop],
  );

  const start = useCallback(
    (velocityPxMs: number) => {
      velocityPxMsRef.current = velocityPxMs;
      hasActiveInertiaRef.current = true;

      rafLoop.start();
    },
    [rafLoop.start],
  );

  const startFrom = useCallback(
    (nextValue: number, velocityPxMs: number) => {
      valueRef.current = nextValue;
      velocityPxMsRef.current = velocityPxMs;
      hasActiveInertiaRef.current = true;

      setValue(nextValue);
      rafLoop.start();
    },
    [rafLoop.start],
  );

  const stop = useCallback(() => {
    if (hasActiveInertiaRef.current) {
      hasActiveInertiaRef.current = false;

      onStopRef.current?.();
    }

    velocityPxMsRef.current = 0;
    rafLoop.stop();
  }, [rafLoop.stop]);

  return {
    value,
    isRunning: rafLoop.isRunning,
    setBounds,
    start,
    startFrom,
    stop,
  };
};
