import type { PropsWithChildren } from 'react';
import React, { createContext, useMemo } from 'react';

import type { HoneyGridStyledProps } from './HoneyGrid.styled';
import { HoneyGridStyled } from './HoneyGrid.styled';

type HoneyGridContextValue = {
  columns: number;
  columnGrowing: boolean;
  spacing: number | undefined;
};

export const HoneyGridContext = createContext<HoneyGridContextValue | undefined>(undefined);

export type HoneyGridProps = HoneyGridStyledProps & {
  /**
   * The number of columns in the grid layout.
   */
  columns: number;
  /**
   * Specifies whether columns should grow to fill available space.
   *
   * @default true
   */
  columnGrowing?: boolean;
};

export const HoneyGrid = ({
  children,
  columns,
  columnGrowing = true,
  spacing,
  ...props
}: PropsWithChildren<HoneyGridProps>) => {
  const contextValue = useMemo<HoneyGridContextValue>(
    () => ({
      columns,
      columnGrowing,
      spacing,
    }),
    [columns, columnGrowing, spacing],
  );

  return (
    <HoneyGridContext.Provider value={contextValue}>
      <HoneyGridStyled spacing={spacing} data-testid="honey-grid" {...props}>
        {children}
      </HoneyGridStyled>
    </HoneyGridContext.Provider>
  );
};
