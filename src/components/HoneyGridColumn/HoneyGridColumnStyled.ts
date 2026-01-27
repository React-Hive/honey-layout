import { css, styled, resolveSpacing } from '@react-hive/honey-style';
import type { ElementType } from 'react';
import type { HoneyBreakpointName } from '@react-hive/honey-style';

import { bpMedia } from '~/helpers';
import { HoneyFlex } from '../HoneyFlex';
import type { Nullable } from '~/types';
import type { HoneyFlexProps } from '../HoneyFlex';

export type HoneyGridColumnStyledProps<Element extends ElementType = 'div'> =
  HoneyFlexProps<Element> & {
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
     * Specifies the breakpoint at which the max-width should be applied
     * or disables it if set to `false`. Can be a breakpoint name.
     */
    applyMaxWidth?: HoneyBreakpointName | false;
    /**
     * Whether to apply calculated `flex-basis`.
     *
     * Useful when the column should size itself naturally
     * (e.g. content-driven or flex-grow scenarios).
     *
     * @default true
     */
    applyBasis?: boolean;
  };

/**
 * This component defines the layout and styling for individual columns in a grid layout.
 * It provides flexibility in specifying the number of columns to take, the total number of columns in the grid,
 * and the spacing between columns.
 */
export const HoneyGridColumnStyled = styled<HoneyGridColumnStyledProps>(HoneyFlex)`
  ${({ columns, takeColumns = 1, spacing = 0, applyMaxWidth, applyBasis = true, theme }) => {
    let columnWidth: Nullable<string> = null;

    if (applyBasis) {
      const fractionalWidth = 100 / columns;

      const columnSpacing = resolveSpacing(spacing, null)({ theme });
      const columnWidthPercent = takeColumns * fractionalWidth;
      const columnGap = (columns - takeColumns) * (columnSpacing / columns);

      columnWidth = `calc(${columnWidthPercent}% - ${columnGap}px)`;
    }

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
