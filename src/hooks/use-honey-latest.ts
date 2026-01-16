import type { RefObject } from 'react';
import { useRef } from 'react';

type UseHoneyLatest = {
  <T>(value: T): RefObject<T>;
  <T>(value: T | undefined): RefObject<T | undefined>;
};

/**
 * Stores the latest value in a stable ref.
 *
 * Guarantees that:
 * - `ref.current` always points to the latest value
 * - the ref object identity never changes
 *
 * Overload behavior:
 * - If a non-optional value is provided, `.current` is non-optional
 * - If an optional value is provided, `.current` is optional
 */
export const useHoneyLatest: UseHoneyLatest = <T>(
  value: T | undefined,
): RefObject<T | undefined> => {
  const ref = useRef<T | undefined>(value);

  ref.current = value;

  return ref;
};
