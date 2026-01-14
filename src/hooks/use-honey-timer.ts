import { useCallback, useEffect, useRef, useState } from 'react';

import type { Nullable } from '../types';
import type { HoneyRafOnFrameHandler } from './use-honey-raf-loop';
import { useHoneyRafLoop } from './use-honey-raf-loop';

/**
 * Timer operating mode.
 *
 * - `countdown` — decreases time until it reaches `targetTimeMs`
 * - `countup` — increases time until it reaches `targetTimeMs` (if provided)
 */
type UseHoneyTimerMode = 'countdown' | 'countup';

type UseHoneyTimerOnEndHandler = () => void;

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
  onEnd?: UseHoneyTimerOnEndHandler;
}

export interface UseHoneyTimerApi {
  /**
   * Current timer value in milliseconds.
   *
   * This value updates over time while the timer is running.
   */
  timerTimeMs: number;
  /**
   * Indicates whether the timer is currently progressing.
   */
  isTimerRunning: boolean;
  /**
   * Starts the timer from `initialTimeMs`, resetting any previous state.
   */
  startTimer: () => void;
  /**
   * Pauses the timer while preserving the current time value.
   */
  pauseTimer: () => void;
  /**
   * Resumes the timer from its current time value.
   *
   * Has no effect if the timer is already running.
   */
  resumeTimer: () => void;
  /**
   * Resets the timer to a specific time value.
   *
   * @param timeMs - Optional new timer value. Defaults to `initialTimeMs`.
   */
  resetTimer: (timeMs?: number) => void;
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

  const timeRef = useRef(timeMs);
  timeRef.current = timeMs;

  const onEndRef = useRef<Nullable<UseHoneyTimerOnEndHandler>>(onEnd);
  onEndRef.current = onEnd;

  /**
   * RAF frame handler responsible for advancing the timer.
   *
   * - Computes the next timer value based on `deltaTimeMs`
   * - Detects completion and stops the RAF loop
   * - Updates React state with the derived value
   */
  const onFrameHandler = useCallback<HoneyRafOnFrameHandler>(
    (deltaTimeMs, { stopRafLoop }) => {
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
        stopRafLoop();

        onEndRef.current?.();
      }
    },
    [mode, targetTimeMs],
  );

  const { startRafLoop, stopRafLoop, isRafLoopRunning } = useHoneyRafLoop(onFrameHandler, {
    autoStart,
  });

  const startTimer = useCallback(() => {
    timeRef.current = initialTimeMs;

    setTimeMs(initialTimeMs);
    startRafLoop();
  }, [initialTimeMs, startRafLoop]);

  const pauseTimer = useCallback(() => {
    stopRafLoop();
  }, [stopRafLoop]);

  const resumeTimer = useCallback(() => {
    if (!isRafLoopRunning) {
      startRafLoop();
    }
  }, [isRafLoopRunning, startRafLoop]);

  const resetTimer = useCallback(
    (nextTimeMs = initialTimeMs) => {
      stopRafLoop();

      timeRef.current = nextTimeMs;
      setTimeMs(nextTimeMs);
    },
    [initialTimeMs, stopRafLoop],
  );

  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
  }, [autoStart, startTimer]);

  return {
    timerTimeMs: timeMs,
    isTimerRunning: isRafLoopRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
};
