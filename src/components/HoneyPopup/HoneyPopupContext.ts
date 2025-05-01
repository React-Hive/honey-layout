import { createContext } from 'react';

export interface HoneyPopupContextProps<Context> {
  context: Context | undefined;
}

export const HoneyPopupContext = createContext<HoneyPopupContextProps<any> | undefined>(undefined);
