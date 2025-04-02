import { createContext } from 'react';

export interface HoneyPopupContextProps<Context> {
  context: Context | undefined;
  closePopup: () => void;
}

export const HoneyPopupContext = createContext<HoneyPopupContextProps<any> | undefined>(undefined);
