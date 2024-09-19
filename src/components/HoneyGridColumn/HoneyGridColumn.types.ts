import type { HoneyGridColumnStyledProps } from './HoneyGridColumn.styled';

export type HoneyGridColumnProps = Omit<
  HoneyGridColumnStyledProps,
  'columns' | 'spacing' | 'totalColumns' | 'totalTakeColumns' | 'applyMaxWidth'
> & {
  //
};
