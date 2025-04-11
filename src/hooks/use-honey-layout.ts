import { useContext } from 'react';

import { HoneyLayoutContext } from '../contexts';
import { assert } from '../helpers';

/**
 * Custom hook to access the Honey layout context.
 *
 * @throws Will throw an error if the hook is used outside of a `HoneyLayoutProvider` component.
 *
 * @returns The context value providing theming utilities and screen state.
 */
export const useHoneyLayout = () => {
  const context = useContext(HoneyLayoutContext);
  assert(
    context,
    'The `useHoneyLayout()` hook must be used inside <HoneyLayoutProvider/> component!',
  );

  return context;
};
