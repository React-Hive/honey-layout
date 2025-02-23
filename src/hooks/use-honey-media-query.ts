import { useTheme } from 'styled-components';
import { useEffect, useState } from 'react';
import throttle from 'lodash.throttle';

import type { HoneyScreenState } from '../types';
import { resolveScreenState } from '../helpers';

export type UseHoneyMediaQueryOptions = {
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
};

/**
 * The hook that tracks the current screen state based on the theme's media breakpoints.
 * It updates the state on window resize and orientation change.
 *
 * @param options - Optional configuration object.
 *
 * @returns The current screen state, indicating the orientation (portrait or landscape)
 *          and the active breakpoint (xs, sm, md, lg, xl).
 */
export const useHoneyMediaQuery = ({
  resizeThrottle = 0,
  overrideScreenState,
}: UseHoneyMediaQueryOptions = {}) => {
  const theme = useTheme();

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
