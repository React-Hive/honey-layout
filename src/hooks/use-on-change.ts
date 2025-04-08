import { useEffect, useRef } from 'react';
import type { EffectCallback } from 'react';

/**
 * A hook that triggers a callback function when the provided state changes.
 * It compares the previous value with the current value and invokes the callback only if a change is detected.
 *
 * @param state - The state to monitor for changes.
 * @param onChange - The callback function to invoke when the state changes.
 */
export const useOnChange = <T>(state: T, onChange: (newState: T) => ReturnType<EffectCallback>) => {
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (prevStateRef.current !== state) {
      prevStateRef.current = state;

      return onChange(state);
    }
  }, [state]);
};
