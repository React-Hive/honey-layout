import { useContext } from 'react';
import type { ReferenceType } from '@floating-ui/react';

import { assert } from '../../../helpers';
import { HoneyPopupContext } from '../HoneyPopupContext';
import type { HoneyPopupContextValue } from '../HoneyPopupContext';

export const useHoneyPopupContext = <
  Context,
  Reference extends ReferenceType = ReferenceType,
>() => {
  const context = useContext<HoneyPopupContextValue<Context, Reference> | undefined>(
    HoneyPopupContext,
  );

  assert(
    context,
    'The `useHoneyPopupContext()` hook can only be used inside <HoneyPopup/> component!',
  );

  return context;
};
