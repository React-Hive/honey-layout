import { createContext } from 'react';
import type { FloatingContext, ReferenceType } from '@floating-ui/react';

export interface HoneyPopupContextValue<Context, Reference extends ReferenceType> {
  context: Context | undefined;
  floatingContext: FloatingContext<Reference>;
}

export const HoneyPopupContext = createContext<HoneyPopupContextValue<any, any> | undefined>(
  undefined,
);
