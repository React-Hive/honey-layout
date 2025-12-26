import type { UseHoneySyntheticScrollOptions } from './use-honey-synthetic-scroll';
import { useHoneySyntheticScroll } from './use-honey-synthetic-scroll';

export const useHoneySyntheticScrollY = <Element extends HTMLElement>(
  options?: Omit<UseHoneySyntheticScrollOptions<Element>, 'axis'>,
) =>
  useHoneySyntheticScroll<Element>({
    ...options,
    axis: 'y',
  });
