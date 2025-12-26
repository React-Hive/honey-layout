import { useEffect, useRef } from 'react';
import type { EffectCallback } from 'react';

/**
 * A hook that invokes a callback function whenever the provided `state` value changes.
 *
 * This hook stores the previous value internally and performs a shallow comparison with the current value.
 * If a change is detected, it executes the `onChange` callback. If the callback returns a cleanup function,
 * it will be invoked before the next change or when the component unmounts, similar to standard `useEffect` behavior.
 *
 * @template T - The type of the state being observed.
 *
 * @param state - The value to monitor for changes. Can be of any type.
 * @param onChange - A function called whenever `state` changes. It may return a cleanup function.
 *
 * @returns void
 *
 * @example
 * ```ts
 * useHoneyOnChange(someValue, (newValue) => {
 *   console.log('Value changed to:', newValue);
 *
 *   return () => {
 *     console.log('Cleanup for value:', newValue);
 *   };
 * });
 * ```
 */
export const useHoneyOnChange = <T>(
  state: T,
  onChange: (newState: T) => ReturnType<EffectCallback>,
) => {
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (prevStateRef.current !== state) {
      prevStateRef.current = state;

      return onChange(state);
    }
  }, [state]);
};
