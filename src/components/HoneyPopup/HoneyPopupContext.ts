import { createContext } from 'react';
import type { FloatingContext, ReferenceType } from '@floating-ui/react';

export interface HoneyPopupContextProps<Context, Reference extends ReferenceType> {
  context: Context | undefined;
  floatingContext: FloatingContext<Reference>;
}

export const HoneyPopupContext = createContext<HoneyPopupContextProps<any, any> | undefined>(
  undefined,
);
