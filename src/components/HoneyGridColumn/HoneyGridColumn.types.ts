import type { HoneyGridColumnStyledProps } from './HoneyGridColumnStyled';

export type HoneyGridColumnProps = Omit<
  HoneyGridColumnStyledProps,
  'columns' | 'spacing' | 'totalColumns' | 'totalTakeColumns' | 'applyMaxWidth'
> & {
  //
};
