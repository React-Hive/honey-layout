import { useEffect } from 'react';

import type { HoneyKeyboardEventCode } from '../types';

export type HoneyDocumentKeyUpHandler = (keyCode: HoneyKeyboardEventCode, e: KeyboardEvent) => void;

type UseHoneyDocumentKeyUpHandlerOptions = {
  /**
   * Determines if the event listener is active.
   *
   * @default true
   */
  isEnabled?: boolean;
};
/**
 * A hook that listens for specific key up events at the document level and triggers a callback function.
 *
 * @param {HoneyDocumentKeyUpHandler} keyUpHandler - The callback function to be triggered when one of the specified keys is released.
 * @param {HoneyKeyboardEventCode[]} listenKeys - An array of key codes to listen for. Only these specified keys will trigger the callback.
 * @param {Object} options - Optional configuration.
 */
export const useHoneyDocumentKeyUpHandler = (
  keyUpHandler: HoneyDocumentKeyUpHandler,
  listenKeys: HoneyKeyboardEventCode[],
  { isEnabled = true }: UseHoneyDocumentKeyUpHandlerOptions = {},
) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyCode = e.code as HoneyKeyboardEventCode;

      if (listenKeys.includes(keyCode)) {
        e.preventDefault();

        keyUpHandler(keyCode, e);
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyUpHandler, isEnabled]);
};
