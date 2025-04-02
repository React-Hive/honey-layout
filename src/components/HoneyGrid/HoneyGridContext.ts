import { createContext } from 'react';

import type { HoneyBreakpointName } from '../../types';

export interface HoneyGridContextProps {
  columns: number;
  spacing: number | undefined;
  isColumnGrowing: boolean;
  applyColumnMaxWidth: HoneyBreakpointName | false;
}

export const HoneyGridContext = createContext<HoneyGridContextProps | undefined>(undefined);
