import { useContext } from 'react';

import { HoneyGridContext } from '../HoneyGridContext';

export const useHoneyGridContext = () => {
  const context = useContext(HoneyGridContext);
  if (!context) {
    throw new Error(
      'The `useHoneyGridContext()` hook can only be used inside <HoneyGrid/> component!',
    );
  }

  return context;
};
