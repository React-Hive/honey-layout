import type { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import type { HoneyBreakpointName } from '../../types';
import type { HoneyBoxProps } from '../HoneyBox';
import { bpMedia, resolveSpacing } from '../../helpers';
import { HoneyFlexBox } from '../HoneyFlexBox';

export interface HoneyGridColumnStyledProps extends HTMLAttributes<HTMLDivElement>, HoneyBoxProps {
  /**
   * Total number of columns in the grid.
   */
  columns: number;
  /**
   * Spacing between grid columns.
   *
   * @default 0
   */
  spacing: number | undefined;
  /**
   * The number of columns this column should take.
   *
   * @default 1
   */
  takeColumns?: number;
  /**
   * Specifies the breakpoint at which the max-width should be applied or disables it if set to `false`.
   * Can be a breakpoint name.
   */
  applyMaxWidth?: HoneyBreakpointName | false;
}

/**
 * This styled component defines the layout and styling for individual columns in a grid layout.
 * It provides flexibility in specifying the number of columns to take, the total number of columns in the grid,
 * and the spacing between columns.
 */
export const HoneyGridColumnStyled = styled(HoneyFlexBox)<HoneyGridColumnStyledProps>`
  ${({ columns, takeColumns = 1, spacing = 0, applyMaxWidth, theme }) => {
    const fractionalWidth = 100 / columns;

    const columnSpacing = resolveSpacing(spacing, null)({ theme });
    const columnWidthPercent = takeColumns * fractionalWidth;
    const columnGap = (columns - takeColumns) * (columnSpacing / columns);

    const columnWidth = `calc(${columnWidthPercent}% - ${columnGap}px)`;

    return css`
      flex-basis: ${columnWidth};

      ${applyMaxWidth &&
      css`
        ${bpMedia(applyMaxWidth).up} {
          max-width: ${columnWidth};
        }
      `}
    `;
  }}
`;
