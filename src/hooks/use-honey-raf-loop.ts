import { useCallback, useEffect, useRef, useState } from 'react';

import type { Nullable } from '~/types';

interface HoneyRafCallbackContext {
  /**
   * Stops the currently running RAF loop.
   *
   * Calling this function immediately:
   * - Cancels the next animation frame
   * - Resets internal timing state
   * - Sets `isRafLoopRunning` to `false`
   *
   * This function is safe to call from within the RAF callback
   * and is the preferred way to terminate the loop based on
   * frame-driven conditions (e.g. inertia decay, animation completion).
   */
  stop: () => void;
}

/**
 * RAF callback invoked on every animation frame.
 *
 * The callback is invoked with the elapsed time since the previous
 * frame and a control context for managing the RAF loop lifecycle.
 *
 * ⚠️ Callback stability
 * The callback should be wrapped in `useCallback` to ensure
 * referential stability and to make dependencies explicit.
 *
 * @param dtMs - Delta time in milliseconds since the previous frame.
 *               The value is clamped to `maxDeltaMs` to avoid large jumps
 *               when the tab is inactive, backgrounded, or the browser
 *               throttles animation frames.
 *
 * @param context - RAF loop control helpers.
 */
export type HoneyRafCallback = (dtMs: number, context: HoneyRafCallbackContext) => void;

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
 * A hook for running a controlled `requestAnimationFrame` loop.
 *
 * Features:
 * - Explicit RAF lifecycle control (`start` / `stop`)
 * - Delta time (`dt`) calculation with frame clamping
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
 * @param callback - Function invoked on each animation frame.
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
 * const onFrame = useCallback<HoneyRafCallback>(
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
  callback: HoneyRafCallback,
  {
    autoStart = false,
    resumeOnVisibility = false,
    maxDeltaMs = 32, // ~30fps clamp
    onError,
  }: UseHoneyRafLoopOptions = {},
) => {
  const rafIdRef = useRef<Nullable<number>>(null);
  const lastTimeRef = useRef<Nullable<number>>(null);

  const callbackRef = useRef(callback);
  // Always keep the latest callback without restarting RAF
  callbackRef.current = callback;

  const [isRafLoopRunning, setIsRafLoopRunning] = useState(false);

  const loop = useCallback<FrameRequestCallback>(
    time => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      let dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Clamp delta (prevents jumps after background tab / lag)
      if (dt > maxDeltaMs) {
        dt = maxDeltaMs;
      }

      try {
        callbackRef.current(dt, {
          stop: stopRafLoop,
        });

        rafIdRef.current = requestAnimationFrame(loop);
      } catch (e) {
        stopRafLoop();

        onError?.(e);
      }
    },
    [maxDeltaMs, onError],
  );

  const startRafLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      return;
    }

    lastTimeRef.current = null;

    setIsRafLoopRunning(true);

    rafIdRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const stopRafLoop = useCallback(() => {
    if (rafIdRef.current === null) {
      return;
    }

    cancelAnimationFrame(rafIdRef.current);

    rafIdRef.current = null;
    lastTimeRef.current = null;

    setIsRafLoopRunning(false);
  }, []);

  useEffect(() => {
    if (autoStart) {
      startRafLoop();
    }

    return stopRafLoop;
  }, [autoStart, startRafLoop, stopRafLoop]);

  // Pause when a tab is hidden (important for mobile)
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopRafLoop();
      } else if (resumeOnVisibility && autoStart) {
        startRafLoop();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [autoStart, resumeOnVisibility, startRafLoop, stopRafLoop]);

  return {
    startRafLoop,
    stopRafLoop,
    isRafLoopRunning,
  };
};
