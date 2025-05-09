import React from 'react';
import type { ElementType } from 'react';
import type { FastOmit } from '@react-hive/honey-style';

import { useHoneyGridContext } from '../HoneyGrid/hooks';
import { HoneyGridColumnStyled } from './HoneyGridColumnStyled';
import type { HoneyGridColumnProps } from './HoneyGridColumn.types';

export const HoneyGridColumn = <Element extends ElementType = 'div'>({
  children,
  ...props
}: FastOmit<HoneyGridColumnProps<Element>, '$flexGrow'>) => {
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
