import { useEffect } from 'react';

import type { HoneyKeyboardEventCode } from '../types';

export type HoneyDocumentKeyUpHandler = (keyCode: HoneyKeyboardEventCode, e: KeyboardEvent) => void;

interface UseHoneyDocumentKeyUpHandlerOptions {
  /**
   * Whether the event listener should be active.
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to call `preventDefault()` on matching keyup events.
   *
   * This is useful for suppressing default browser behavior (e.g., scrolling with Space key).
   *
   * @default true
   */
  preventDefault?: boolean;
}

/**
 * Hook for handling specific key up events on the `document` object.
 *
 * This hook adds a `keyup` event listener at the document level and triggers the provided `keyUpHandler`
 * when one of the specified `listenKeys` is released.
 *
 * @param keyUpHandler - The callback function invoked when a matching key is released.
 * @param listenKeys - An array of key codes (`KeyboardEvent.code`) to listen for.
 * @param options - Optional configuration to control event behavior and listener activation.
 *
 * @example
 * ```tsx
 * useHoneyDocumentKeyUpHandler(
 *   (keyCode, event) => {
 *     console.log('Key released:', keyCode);
 *   },
 *   ['Escape'],
 * );
 * ```
 */
export const useHoneyDocumentKeyUpHandler = (
  keyUpHandler: HoneyDocumentKeyUpHandler,
  listenKeys: HoneyKeyboardEventCode[],
  { enabled = true, preventDefault = true }: UseHoneyDocumentKeyUpHandlerOptions = {},
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyCode = e.code as HoneyKeyboardEventCode;

      if (listenKeys.includes(keyCode)) {
        if (preventDefault) {
          e.preventDefault();
        }

        keyUpHandler(keyCode, e);
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyUpHandler, enabled, preventDefault]);
};
