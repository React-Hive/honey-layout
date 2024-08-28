import { useContext } from 'react';

import { HoneyGridContext } from '../HoneyGrid';

export const useCurrentHoneyGrid = () => {
  const context = useContext(HoneyGridContext);
  if (!context) {
    throw new Error(
      'The `useCurrentHoneyGrid()` hook can only be used inside <HoneyGrid/> component!',
    );
  }

  return context;
};
