import { useEffect, useState } from 'react';
import throttle from 'lodash.throttle';
import type { HoneyTheme } from '@react-hive/honey-style';

import { resolveScreenState } from '../helpers';
import type { HoneyScreenState } from '../types';

export interface UseHoneyMediaQueryOptions {
  /**
   * Throttle interval (in milliseconds) for the resize event handler.
   * This limits how often the handler runs during continuous resize events.
   *
   * @default 0
   */
  resizeThrottle?: number;
  /**
   * Manually override screen state properties like isXs, isPortrait, etc.
   *
   * @remarks
   * These values are only set once on initialization and will not dynamically update the state.
   */
  overrideScreenState?: Partial<HoneyScreenState>;
}

/**
 * Whether two screen states hold the same value for every flag.
 */
const isSameScreenState = (a: HoneyScreenState, b: HoneyScreenState) =>
  (Object.keys(b) as (keyof HoneyScreenState)[]).every(key => a[key] === b[key]);

/**
 * The hook that tracks the current screen state based on the theme's media breakpoints.
 * It updates the state on window resize and orientation change.
 *
 * The state object is kept until one of its flags changes, so resizing within a breakpoint
 * re-renders nothing that reads it. Mobile browsers fire `resize` whenever their toolbar
 * collapses on scroll.
 *
 * @param theme - Theme object.
 * @param options - Optional configuration object.
 *
 * @returns The current screen state, indicating the orientation (portrait or landscape)
 *          and the active breakpoint (xs, sm, md, lg, xl).
 */
export const useHoneyMediaQuery = (
  theme: HoneyTheme,
  { resizeThrottle = 0, overrideScreenState }: UseHoneyMediaQueryOptions = {},
) => {
  const [screenState, setScreenState] = useState<HoneyScreenState>(() => ({
    ...resolveScreenState(theme.breakpoints),
    ...overrideScreenState,
  }));

  useEffect(() => {
    const handleResize = throttle(() => {
      const nextScreenState: HoneyScreenState = {
        ...resolveScreenState(theme.breakpoints),
        ...overrideScreenState,
      };

      setScreenState(prevScreenState =>
        isSameScreenState(prevScreenState, nextScreenState) ? prevScreenState : nextScreenState,
      );
    }, resizeThrottle);

    handleResize();

    window.addEventListener('resize', handleResize);

    window.screen.orientation.addEventListener('change', handleResize);

    return () => {
      handleResize.cancel();

      window.removeEventListener('resize', handleResize);

      window.screen.orientation.removeEventListener('change', handleResize);
    };
  }, []);

  return screenState;
};
