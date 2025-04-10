import React from 'react';
import type { ElementType } from 'react';

import { HoneyGridColumnStyled } from './HoneyGridColumnStyled';
import { useHoneyGridContext } from '../HoneyGrid/hooks';
import type { HoneyGridColumnProps } from './HoneyGridColumn.types';

export const HoneyGridColumn = <Element extends ElementType = 'div'>({
  children,
  ...props
}: Omit<HoneyGridColumnProps<Element>, '$flexGrow'>) => {
  const { columns, spacing, isColumnGrowing, applyColumnMaxWidth } = useHoneyGridContext();

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
