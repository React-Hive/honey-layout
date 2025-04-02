import { useContext } from 'react';

import { HoneyPopupContext } from '../HoneyPopupContext';

export const useHoneyPopupContext = () => {
  const context = useContext(HoneyPopupContext);
  if (!context) {
    throw new Error(
      'The `useHoneyPopupContext()` hook can only be used inside <HoneyPopup/> component!',
    );
  }

  return context;
};
