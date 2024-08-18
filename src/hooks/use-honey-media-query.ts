import { useTheme } from 'styled-components';
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

import type { HoneyBreakpoints, HoneyScreenState } from '../types';

const calculateScreenState = (
  breakpoints: Partial<HoneyBreakpoints> | undefined,
): HoneyScreenState => {
  const isPortrait = window.innerHeight > window.innerWidth;
  const isLandscape = !isPortrait;

  if (!breakpoints) {
    return {
      isPortrait,
      isLandscape,
      isXs: false,
      isSm: false,
      isMd: false,
      isLg: false,
      isXl: false,
    };
  }

  const sortedBreakpoints = Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b) // Sort breakpoints in ascending order of width
    .map(([name]) => name) as (keyof Partial<HoneyBreakpoints>)[];

  const currentBreakpoint =
    sortedBreakpoints.find(breakpoint => {
      const screenSize = breakpoints[breakpoint];

      return screenSize ? window.innerWidth < screenSize : false;
    }) || sortedBreakpoints.pop(); // Use the largest breakpoint if no match is found

  return {
    isPortrait,
    isLandscape,
    isXs: currentBreakpoint === 'xs',
    isSm: currentBreakpoint === 'sm',
    isMd: currentBreakpoint === 'md',
    isLg: currentBreakpoint === 'lg',
    isXl: currentBreakpoint === 'xl',
  };
};

type UseHoneyMediaQueryOptions = {
  /**
   * The delay in milliseconds before the resize event is processed.
   *
   * @default 0
   */
  delay?: number;
};

/**
 * A hook for tracking the current screen state based on media queries defined in the theme.
 *
 * @param options - Optional configuration.
 *
 * @returns The current screen state.
 */
export const useHoneyMediaQuery = ({ delay = 0 }: UseHoneyMediaQueryOptions = {}) => {
  const theme = useTheme();

  const [screenState, setScreenState] = useState<HoneyScreenState>(() =>
    calculateScreenState(theme.breakpoints),
  );

  useEffect(() => {
    const handleResize = debounce(() => {
      setScreenState(calculateScreenState(theme.breakpoints));
    }, delay);

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      handleResize.cancel();

      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenState;
};
