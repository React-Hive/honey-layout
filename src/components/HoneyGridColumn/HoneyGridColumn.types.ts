import type { ElementType } from 'react';

import type { HoneyGridColumnStyledProps } from './HoneyGridColumnStyled';

export type HoneyGridColumnProps<Element extends ElementType = 'div'> = Omit<
  HoneyGridColumnStyledProps<Element>,
  'columns' | 'spacing' | 'totalColumns' | 'totalTakeColumns' | 'applyMaxWidth'
>;
