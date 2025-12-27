import type { UseHoneySyntheticScrollOptions } from './use-honey-synthetic-scroll';
import { useHoneySyntheticScroll } from './use-honey-synthetic-scroll';

/**
 * Enables synthetic horizontal (X-axis) scrolling for a container element
 * using pointer-based drag interactions.
 *
 * This is a convenience wrapper around {@link useHoneySyntheticScroll} with
 * the axis fixed to `'x'`.
 *
 * All behavior, boundaries, and lifecycle guarantees are identical to the
 * base hook, but limited to horizontal movement only.
 *
 * @template Element - The HTML element type of the scrollable container.
 *
 * @param options - Configuration options forwarded to
 * {@link useHoneySyntheticScroll}, excluding the `axis` option.
 *
 * @returns A ref that must be attached to the scrollable container element.
 */
export const useHoneySyntheticScrollX = <Element extends HTMLElement>(
  options?: Omit<UseHoneySyntheticScrollOptions<Element>, 'axis'>,
) =>
  useHoneySyntheticScroll<Element>({
    ...options,
    axis: 'x',
  });
