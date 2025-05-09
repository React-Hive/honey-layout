import type { ElementType } from 'react';
import type { FastOmit } from '@react-hive/honey-style';

import type { HoneyGridColumnStyledProps } from './HoneyGridColumnStyled';

export type HoneyGridColumnProps<Element extends ElementType = 'div'> = FastOmit<
  HoneyGridColumnStyledProps<Element>,
  'columns' | 'spacing' | 'totalColumns' | 'totalTakeColumns' | 'applyMaxWidth'
>;
