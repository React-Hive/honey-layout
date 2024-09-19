import type { PropsWithChildren } from 'react';
import React from 'react';

import type { HoneyGridColumnProps } from './HoneyGridColumn.types';
import { HoneyGridColumnStyled } from './HoneyGridColumn.styled';
import { useCurrentHoneyGrid } from '../HoneyGrid/hooks';

export const HoneyGridColumn = ({
  children,
  ...props
}: PropsWithChildren<HoneyGridColumnProps>) => {
  const { columns, spacing, isColumnGrowing, applyColumnMaxWidth } = useCurrentHoneyGrid();

  return (
    <HoneyGridColumnStyled
      columns={columns}
      spacing={spacing}
      applyMaxWidth={applyColumnMaxWidth}
      $flexGrow={isColumnGrowing ? 1 : 0}
      // Data
      data-testid="honey-grid-column"
      {...props}
    >
      {children}
    </HoneyGridColumnStyled>
  );
};
