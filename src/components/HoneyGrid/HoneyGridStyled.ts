import type { HTMLAttributes } from 'react';
import * as CSS from 'csstype';
import styled, { css } from 'styled-components';

import type { HoneyBoxProps } from '../HoneyBox';
import { resolveSpacing } from '../../helpers';
import { HoneyBox } from '../HoneyBox';
import { HoneyGridColumnStyled } from '../HoneyGridColumn/HoneyGridColumnStyled';

export interface HoneyGridStyledProps
  extends HTMLAttributes<HTMLDivElement>,
    // Omit the `$gap` because `spacing` prop overrides that value
    Omit<HoneyBoxProps, '$gap'> {
  /**
   * The height of each grid column.
   */
  columnHeight?: CSS.Properties['height'];
  /**
   * The minimum height of each grid column.
   */
  minColumnHeight?: CSS.Properties['minHeight'];
  /**
   * The spacing between grid columns.
   *
   * @default 0
   */
  spacing?: number;
}

export const HoneyGridStyled = styled(HoneyBox).attrs(({ $flexWrap }) => ({
  $flexWrap: $flexWrap ?? 'wrap',
}))<HoneyGridStyledProps>`
  ${({ columnHeight, minColumnHeight, spacing = 0 }) => css`
    display: flex;
    gap: ${resolveSpacing(spacing)};

    > ${HoneyGridColumnStyled} {
      height: ${columnHeight};
      min-height: ${minColumnHeight};
    }
  `}
`;
