import { useEffect } from 'react';
import { isFunction } from '@react-hive/honey-utils';
import throttle from 'lodash.throttle';

export type UseHoneyResizeHandler = () => void;

interface UseHoneyResizeOptions {
  /**
   * Whether to invoke the resize handler immediately on mount.
   *
   * Useful when initial layout measurements should be performed
   * before any resize events occur.
   *
   * @default false
   */
  invokeOnMount?: boolean;
  /**
   * Throttle delay (in milliseconds) applied to the resize handler.
   *
   * When greater than `0`, the handler will be throttled using
   * `lodash.throttle` to reduce invocation frequency.
   *
   * @default 0
   */
  throttleTime?: number;
  /**
   * Enables or disables the resize listener.
   *
   * @default true
   */
  enabled?: boolean;
}

/**
 * A hook that subscribes to the window `resize` event and invokes a handler function in response.
 *
 * The handler can be optionally throttled to limit execution frequency, which is useful
 * for expensive layout calculations or DOM measurements.
 *
 * @example
 * ```ts
 * useHoneyResize(() => {
 *   console.log('Window resized');
 * }, { throttleTime: 200 });
 * ```
 *
 * @param handler - Callback invoked when the window is resized.
 * @param options - Configuration options controlling invocation timing and performance.
 */

export const useHoneyResize = (
  handler: UseHoneyResizeHandler,
  { invokeOnMount = false, throttleTime = 0, enabled = true }: UseHoneyResizeOptions = {},
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleResize: UseHoneyResizeHandler | ReturnType<typeof throttle> = throttleTime
      ? throttle(handler, throttleTime)
      : handler;

    window.addEventListener('resize', handleResize);

    if (invokeOnMount) {
      handler();
    }

    return () => {
      if ('cancel' in handleResize && isFunction(handleResize.cancel)) {
        handleResize.cancel();
      }

      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, invokeOnMount, handler]);
};
