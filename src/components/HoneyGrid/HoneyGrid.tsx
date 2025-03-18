import type { PropsWithChildren } from 'react';
import React, { forwardRef, createContext, useMemo } from 'react';

import type { HoneyBreakpointName } from '../../types';
import type { HoneyGridStyledProps } from './HoneyGridStyled';
import type { HoneyGridColumnStyledProps } from '../HoneyGridColumn';
import { HoneyGridStyled } from './HoneyGridStyled';

type HoneyGridContextValue = {
  columns: number;
  spacing: number | undefined;
  isColumnGrowing: boolean;
  applyColumnMaxWidth: HoneyBreakpointName | false;
};

export const HoneyGridContext = createContext<HoneyGridContextValue | undefined>(undefined);

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

export const HoneyGrid = forwardRef<HTMLDivElement, PropsWithChildren<HoneyGridProps>>(
  (
    { children, columns, spacing, isColumnGrowing = true, applyColumnMaxWidth = false, ...props },
    ref,
  ) => {
    const contextValue = useMemo<HoneyGridContextValue>(
      () => ({
        columns,
        spacing,
        isColumnGrowing,
        applyColumnMaxWidth,
      }),
      [columns, spacing, isColumnGrowing, applyColumnMaxWidth],
    );

    return (
      <HoneyGridContext.Provider value={contextValue}>
        <HoneyGridStyled ref={ref} spacing={spacing} data-testid="honey-grid" {...props}>
          {children}
        </HoneyGridStyled>
      </HoneyGridContext.Provider>
    );
  },
);

HoneyGrid.displayName = 'HoneyGrid';
