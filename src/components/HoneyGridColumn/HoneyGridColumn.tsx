import type { PropsWithChildren } from 'react';
import React from 'react';

import type { HoneyGridColumnProps } from './HoneyGridColumn.types';
import { HoneyGridColumnStyled } from './HoneyGridColumn.styled';
import { useCurrentHoneyGrid } from '../HoneyGrid/hooks';

export const HoneyGridColumn = ({
  children,
  ...props
}: PropsWithChildren<HoneyGridColumnProps>) => {
  const { columns, columnGrowing, spacing } = useCurrentHoneyGrid();

  return (
    <HoneyGridColumnStyled
      columns={columns}
      spacing={spacing}
      $flexGrow={columnGrowing ? 1 : 0}
      // Data
      data-testid="honey-grid-column"
      {...props}
    >
      {children}
    </HoneyGridColumnStyled>
  );
};
