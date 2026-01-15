import { useCallback, useEffect, useRef, useState } from 'react';

import type { Nullable } from '~/types';
import { __DEV__ } from '~/constants';
import { useHoneyLatest } from '~/hooks';

interface HoneyRafFrameContext {
  /**
   * Immediately terminates the active `requestAnimationFrame` loop.
   *
   * This method is **safe to call synchronously from within the frame handler**
   * and is the **recommended mechanism** for ending frame-driven processes based on runtime conditions.
   *
   * Typical use cases:
   * - Inertia or momentum decay reaching a threshold
   * - Animation or transition completion
   * - Time- or state-based termination conditions
   */
  stop: () => void;
}

/**
 * Function invoked on every animation frame while the RAF loop is active.
 *
 * The handler is expected to be **side-effect driven** and may:
 * - Mutate refs
 * - Update React state
 * - Stop the RAF loop via `context.stop()`
 *
 * ⚠️ Referential stability
 * This handler **must be wrapped in `useCallback`** to avoid unnecessary
 * re-bindings and to ensure predictable behavior across renders.
 *
 * @param deltaTimeMs - Time delta in milliseconds since the previous frame.
 *                      This value is clamped to `maxDeltaMs` to prevent large
 *                      time steps caused by tab backgrounding, visibility changes,
 *                      or browser throttling.
 *
 * @param context - RAF lifecycle control context. See {@link HoneyRafFrameContext}.
 */
export type HoneyRafFrameHandler = (deltaTimeMs: number, context: HoneyRafFrameContext) => void;

/**
 * Configuration options for {@link useHoneyRafLoop}.
 */
interface UseHoneyRafLoopOptions {
  /**
   * Automatically start the RAF loop on mount.
   *
   * This is useful for continuous loops (e.g. visualizers),
   * but should generally be disabled for gesture- or intent-driven animations.
   *
   * @default false
   */
  autoStart?: boolean;
  /**
   * Whether the RAF loop should automatically resume when the
   * document becomes visible again after being hidden.
   *
   * ⚠️ Important:
   * - Visibility changes will ALWAYS stop the RAF loop
   * - Resuming is **opt-in** and never happens implicitly
   *
   * This option should only be enabled for truly continuous
   * systems (e.g. game loops, live visualizations).
   *
   * It is intentionally disabled by default to avoid restarting
   * gesture-driven or state-sensitive animations with stale data.
   *
   * Requires `autoStart` to be enabled.
   *
   * @default false
   */
  resumeOnVisibility?: boolean;
  /**
   * Maximum allowed delta time between frames.
   *
   * This prevents physics, inertia, or animation logic from receiving large
   * time steps after backgrounding, tab switches, or frame drops.
   *
   * @default 32
   */
  maxDeltaMs?: number;
  /**
   * Optional error handler invoked when the RAF callback throws.
   *
   * When an error occurs:
   * - The RAF loop is immediately stopped
   * - `isRafLoopRunning` is set to `false`
   * - The error is passed to this handler
   *
   * @default undefined
   */
  onError?: (error: unknown) => void;
}

/**
 * Public control API returned by {@link useHoneyRafLoop}.
 */
export interface HoneyRafLoopApi {
  /**
   * Indicates whether the RAF loop is currently running.
   */
  isRunning: boolean;
  /**
   * Starts the RAF loop.
   *
   * If the loop is already running, this call is ignored.
   */
  start: () => void;
  /**
   * Stops the RAF loop immediately.
   *
   * This method is safe to call:
   * - From user code
   * - From within the RAF frame handler
   */
  stop: () => void;
}

/**
 * A hook for running a controlled `requestAnimationFrame` loop.
 *
 * Features:
 * - Explicit RAF lifecycle control (`start` / `stop`)
 * - Delta time calculation with frame clamping
 * - Automatic cleanup on unmounting
 * - Conservative handling of tab visibility changes (mobile-safe)
 * - Safe error handling (stops loop on exception)
 *
 * Visibility behavior:
 * - The RAF loop is always stopped when the document becomes hidden
 * - Automatic resume is disabled by default and must be explicitly enabled
 *
 * This hook is designed for gesture handling, inertia, physics simulations,
 * and animation loops that must not trigger React re-renders on every frame.
 *
 * @param onFrame - Function invoked on each animation frame.
 * @param options  - Optional configuration for the RAF loop.
 *
 * @returns Control helpers and RAF loop state.
 *
 * @example
 * ```ts
 * // Gesture-driven inertia (recommended usage)
 * // The RAF loop stops itself when motion decays.
 *
 * const velocityRef = useRef({ x: 12, y: 4 });
 *
 * const onFrame = useCallback<HoneyRafOnFrameHandler>(
 *   (dtMs, { stop }) => {
 *     velocityRef.current.x *= 0.94;
 *     velocityRef.current.y *= 0.94;
 *
 *     setPosition(p => ({
 *       x: p.x + velocityRef.current.x,
 *       y: p.y + velocityRef.current.y,
 *     }));
 *
 *     if (
 *       Math.abs(velocityRef.current.x) < 0.1 &&
 *       Math.abs(velocityRef.current.y) < 0.1
 *     ) {
 *       stop(); // terminate RAF loop
 *     }
 *   },
 *   [],
 * );
 *
 * useHoneyRafLoop(onFrame);
 * ```
 */
export const useHoneyRafLoop = (
  onFrame: HoneyRafFrameHandler,
  {
    autoStart = false,
    resumeOnVisibility = false,
    maxDeltaMs = 32, // ~30fps clamp
    onError,
  }: UseHoneyRafLoopOptions = {},
): HoneyRafLoopApi => {
  const rafIdRef = useRef<Nullable<number>>(null);
  const lastTimeMsRef = useRef<Nullable<number>>(null);

  const onFrameRef = useHoneyLatest(onFrame);

  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);

  const stop = useCallback(() => {
    if (!isRunningRef.current) {
      return;
    }

    isRunningRef.current = false;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = null;
    }

    lastTimeMsRef.current = null;
    setIsRunning(false);
  }, []);

  const loop = useCallback<FrameRequestCallback>(
    timeMs => {
      if (!isRunningRef.current) {
        return;
      }

      if (lastTimeMsRef.current === null) {
        lastTimeMsRef.current = timeMs;
      }

      let deltaTimeMs = timeMs - lastTimeMsRef.current;
      lastTimeMsRef.current = timeMs;

      // Clamp delta (prevents jumps after background tab / lag)
      if (deltaTimeMs > maxDeltaMs) {
        deltaTimeMs = maxDeltaMs;
      }

      try {
        onFrameRef.current(deltaTimeMs, {
          stop,
        });

        if (isRunningRef.current) {
          rafIdRef.current = requestAnimationFrame(loop);
        }
      } catch (e) {
        if (__DEV__) {
          console.error(e);
        }

        stop();

        onError?.(e);
      }
    },
    [maxDeltaMs, stop, onError],
  );

  const start = useCallback(() => {
    if (isRunningRef.current) {
      return;
    }

    lastTimeMsRef.current = null;

    isRunningRef.current = true;
    setIsRunning(true);

    rafIdRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return stop;
  }, [autoStart]);

  // Pause when a tab is hidden (important for mobile)
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else if (resumeOnVisibility && autoStart) {
        start();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [autoStart, resumeOnVisibility, start, stop]);

  return {
    isRunning,
    start,
    stop,
  };
};
