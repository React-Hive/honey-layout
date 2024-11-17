import { useContext } from 'react';

import type { HoneyLayoutContextValue } from '../contexts';
import { HoneyLayoutContext } from '../contexts';

/**
 * Custom hook to access the Honey layout context.
 *
 * @throws Will throw an error if the hook is used outside of a `HoneyLayoutProvider` component.
 *
 * @returns {HoneyLayoutContextValue} - The context value providing theming utilities and screen state.
 */
export const useHoneyLayout = (): HoneyLayoutContextValue => {
  const context = useContext(HoneyLayoutContext);
  if (!context) {
    throw new Error(
      'The `useHoneyLayout()` hook must be used inside <HoneyLayoutProvider/> component!',
    );
  }

  return context;
};
