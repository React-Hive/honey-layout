import React, { useMemo } from 'react';

import { HoneyGridContext } from './HoneyGridContext';
import { HoneyGridStyled } from './HoneyGridStyled';
import type { HoneyGridContextProps } from './HoneyGridContext';
import type { HoneyGridStyledProps } from './HoneyGridStyled';
import type { HoneyGridColumnStyledProps } from '../HoneyGridColumn';

export interface HoneyGridProps extends HoneyGridStyledProps {
  /**
   * The number of columns in the grid layout.
   */
  columns: number;
  /**
   * Specifies whether columns should grow to fill available space.
   *
   * @default true
   */
  isColumnGrowing?: boolean;
  /**
   * Specifies the breakpoint at which the max-width should be applied to the columns or disables it if set to `false`.
   * Can be a breakpoint name.
   *
   * @default false
   */
  applyColumnMaxWidth?: HoneyGridColumnStyledProps['applyMaxWidth'];
}

export const HoneyGrid = ({
  ref,
  children,
  columns,
  spacing,
  isColumnGrowing = true,
  applyColumnMaxWidth = false,
  ...props
}: HoneyGridProps) => {
  const contextValue = useMemo<HoneyGridContextProps>(
    () => ({
      columns,
      spacing,
      isColumnGrowing,
      applyColumnMaxWidth,
    }),
    [columns, spacing, isColumnGrowing, applyColumnMaxWidth],
  );

  return (
    <HoneyGridContext value={contextValue}>
      <HoneyGridStyled ref={ref} spacing={spacing} data-testid="honey-grid" {...props}>
        {children}
      </HoneyGridStyled>
    </HoneyGridContext>
  );
};
