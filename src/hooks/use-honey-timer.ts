import { useCallback, useEffect, useRef, useState } from 'react';

import type { Nullable } from '../types';
import type { HoneyRafFrameHandler } from '~/hooks';
import { useHoneyLatest, useHoneyRafLoop } from '~/hooks';

/**
 * Timer operating mode.
 *
 * - `countdown` — decreases time until it reaches `targetTimeMs`
 * - `countup` — increases time until it reaches `targetTimeMs` (if provided)
 */
type UseHoneyTimerMode = 'countdown' | 'countup';

type UseHoneyTimerEndHandler = () => void;

export interface UseHoneyTimerOptions {
  /**
   * Initial timer value in milliseconds.
   *
   * - Countdown: starting time
   * - Count-up: initial offset
   */
  initialTimeMs: number;
  /**
   * Target time in milliseconds.
   *
   * - Countdown: usually `0`
   * - Count-up: optional upper limit
   *
   * When reached, the timer stops and `onEnd` is invoked.
   *
   * @default 0
   */
  targetTimeMs?: number;
  /**
   * Direction in which the timer progresses.
   *
   * @default 'countdown'
   */
  mode?: UseHoneyTimerMode;
  /**
   * Whether the timer should automatically start on mount.
   *
   * @default false
   */
  autoStart?: boolean;
  /**
   * Optional callback invoked exactly once when the timer reaches the target time.
   */
  onEnd?: UseHoneyTimerEndHandler;
}

/**
 * Public control API returned by {@link useHoneyTimer}.
 */
export interface UseHoneyTimerApi {
  /**
   * Current timer value in milliseconds.
   *
   * This value updates over time while the timer is running.
   */
  timeMs: number;
  /**
   * Indicates whether the timer is currently progressing.
   */
  isRunning: boolean;
  /**
   * Starts the timer from `initialTimeMs`, resetting any previous state.
   */
  start: () => void;
  /**
   * Pauses the timer while preserving the current time value.
   */
  pause: () => void;
  /**
   * Resumes the timer from its current time value.
   *
   * Has no effect if the timer is already running.
   */
  resume: () => void;
  /**
   * Resets the timer to a specific time value.
   *
   * @param timeMs - Optional new timer value. Defaults to `initialTimeMs`.
   */
  reset: (timeMs?: number) => void;
}

/**
 * A high-precision timer hook built on top of {@link useHoneyRafLoop}.
 *
 * Features:
 * - Frame-accurate time progression using `requestAnimationFrame`
 * - Supports countdown and count-up modes
 * - Explicit lifecycle control (start / pause / resume / reset)
 * - Drift-free timing using delta-based updates
 * - Safe completion handling via `onEnd`
 *
 * Architectural notes:
 * - Time progression is handled imperatively via refs to avoid stale closures and unnecessary re-renders.
 * - React state is updated only with the derived timer value.
 * - RAF lifecycle is fully delegated to `useHoneyRafLoop`.
 *
 * @example
 * ```ts
 * const timer = useHoneyTimer({
 *   initialTimeMs: 10_000,
 *   targetTimeMs: 0,
 *   onEnd: () => console.log('Done'),
 * });
 *
 * timer.startTimer();
 * ```
 */
export const useHoneyTimer = ({
  initialTimeMs,
  targetTimeMs = 0,
  mode = 'countdown',
  autoStart = false,
  onEnd,
}: UseHoneyTimerOptions): UseHoneyTimerApi => {
  const [timeMs, setTimeMs] = useState(initialTimeMs);
  const timeRef = useHoneyLatest(timeMs);

  const onEndRef = useHoneyLatest<Nullable<UseHoneyTimerEndHandler>>(onEnd);

  /**
   * RAF frame handler responsible for advancing the timer.
   *
   * - Computes the next timer value based on `deltaTimeMs`
   * - Detects completion and stops the RAF loop
   * - Updates React state with the derived value
   */
  const frameHandler = useCallback<HoneyRafFrameHandler>(
    (deltaTimeMs, frameContext) => {
      let nextTime =
        mode === 'countdown' ? timeRef.current - deltaTimeMs : timeRef.current + deltaTimeMs;

      let finished = false;

      if (mode === 'countdown') {
        if (nextTime <= targetTimeMs) {
          nextTime = targetTimeMs;
          finished = true;
        }
      } else if (targetTimeMs > 0 && nextTime >= targetTimeMs) {
        nextTime = targetTimeMs;
        finished = true;
      }

      timeRef.current = nextTime;
      setTimeMs(nextTime);

      if (finished) {
        frameContext.stop();

        onEndRef.current?.();
      }
    },
    [mode, targetTimeMs],
  );

  const rafLoop = useHoneyRafLoop(frameHandler);

  const start = useCallback(() => {
    timeRef.current = initialTimeMs;

    setTimeMs(initialTimeMs);
    rafLoop.start();
  }, [initialTimeMs, rafLoop.start]);

  const pause = useCallback(() => {
    rafLoop.stop();
  }, [rafLoop.stop]);

  const resume = useCallback(() => {
    if (!rafLoop.isRunning) {
      rafLoop.start();
    }
  }, [rafLoop.isRunning, rafLoop.start]);

  const reset = useCallback(
    (nextTimeMs = initialTimeMs) => {
      rafLoop.stop();

      timeRef.current = nextTimeMs;
      setTimeMs(nextTimeMs);
    },
    [initialTimeMs, rafLoop.stop],
  );

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart]);

  return {
    timeMs,
    isRunning: rafLoop.isRunning,
    start,
    pause,
    resume,
    reset,
  };
};
