import { useEffect, useState } from 'react';
import throttle from 'lodash.throttle';
import type { HoneyTheme } from '@react-hive/honey-style';

import { resolveScreenState } from '~/helpers';
import type { HoneyScreenState } from '~/types';

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
 * The hook that tracks the current screen state based on the theme's media breakpoints.
 * It updates the state on window resize and orientation change.
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
      setScreenState({
        ...resolveScreenState(theme.breakpoints),
        ...overrideScreenState,
      });
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
