import * as CSS from 'csstype';
import styled, { css } from 'styled-components';

import { resolveSpacing } from '../../helpers';
import { HoneyBox } from '../HoneyBox';
import { HoneyGridColumnStyled } from '../HoneyGridColumn/HoneyGridColumnStyled';
import type { HoneyBoxProps } from '../HoneyBox';

export interface HoneyGridStyledProps
  // Omit the `$gap` because `spacing` prop overrides that value
  extends Omit<HoneyBoxProps, '$gap'> {
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

export const HoneyGridStyled = styled(HoneyBox).attrs<HoneyGridStyledProps>(
  ({ $flexWrap = 'wrap' }) => ({
    $flexWrap,
  }),
)`
  ${({ columnHeight, minColumnHeight, spacing = 0 }) => css`
    display: flex;
    gap: ${resolveSpacing(spacing)};

    > ${HoneyGridColumnStyled} {
      height: ${columnHeight};
      min-height: ${minColumnHeight};
    }
  `}
`;
