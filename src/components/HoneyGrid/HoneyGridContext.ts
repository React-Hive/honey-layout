import { createContext } from 'react';
import type { HoneyBreakpointName } from '@react-hive/honey-style';

export interface HoneyGridContextProps {
  columns: number;
  spacing: number | undefined;
  isColumnsGrowing: boolean;
  applyColumnMaxWidth: HoneyBreakpointName | false;
}

export const HoneyGridContext = createContext<HoneyGridContextProps | undefined>(undefined);
