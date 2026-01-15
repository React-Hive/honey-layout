import { useRef } from 'react';

/**
 * Stores the latest value in a stable ref.
 *
 * This hook guarantees that:
 * - `ref.current` is always the latest value
 * - the returned ref object identity never changes
 *
 * It is especially useful for:
 * - callbacks used inside `requestAnimationFrame`
 * - event listeners
 * - timers and intervals
 * - observers and imperative APIs
 *
 * @template T - The type of the stored value.
 *
 * @param value - The value to keep up to date.
 *
 * @returns A ref object whose `.current` always points to the latest value.
 *
 * @example
 * ```ts
 * const onStopRef = useHoneyLatest(onStop);
 *
 * // later, inside RAF / event / async code
 * onStopRef.current?.();
 * ```
 */
export const useHoneyLatest = <T>(value: T) => {
  const ref = useRef(value);

  // Always keep the latest value without changing ref identity
  ref.current = value;

  return ref;
};
