import styled, { css } from 'styled-components';

import type { HoneyBoxProps } from '../HoneyBox';
import { bpMedia, resolveSpacing } from '../../helpers';
import { HoneyBox } from '../HoneyBox';

export type HoneyGridColumnStyledProps = HoneyBoxProps & {
  /**
   * Total number of columns in the grid.
   */
  columns: number;
  /**
   * Spacing between grid columns.
   */
  spacing: number | undefined;
  /**
   * Number of columns this component should take.
   *
   * @default 1
   */
  takeColumns?: number;
};

/**
 * This styled component defines the layout and styling for individual columns in a grid layout.
 * It provides flexibility in specifying the number of columns to take, the total number of columns in the grid,
 * and the spacing between columns.
 */
export const HoneyGridColumnStyled = styled(HoneyBox)<HoneyGridColumnStyledProps>`
  ${({ columns, takeColumns = 1, spacing = 0, theme }) => {
    const fractionalWidth = 100 / columns;

    const columnSpacing = resolveSpacing(spacing, null)({ theme });
    const columnWidth = takeColumns * fractionalWidth;
    const columnGap = (columns - takeColumns) * (columnSpacing / columns);

    return css`
      display: flex;
      flex-direction: column;
      flex-basis: calc(${columnWidth}% - ${columnGap}px);

      overflow: hidden;

      ${bpMedia('lg').up} {
        max-width: calc(${columnWidth}% - ${columnGap}px);
      }
    `;
  }}
`;
