import * as CSS from 'csstype';
import { css, styled } from '@react-hive/honey-style';
import type { FastOmit } from '@react-hive/honey-style';

import { resolveSpacing } from '../../helpers';
import { HoneyBox } from '../HoneyBox';
import { HoneyGridColumnStyled } from '../HoneyGridColumn/HoneyGridColumnStyled';
import type { HoneyBoxProps } from '../HoneyBox';

export interface HoneyGridStyledProps
  // Omit the `$gap` because `spacing` prop overrides that value
  extends FastOmit<HoneyBoxProps, '$gap'> {
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

export const HoneyGridStyled = styled<HoneyGridStyledProps>(HoneyBox, ({ $flexWrap = 'wrap' }) => ({
  $flexWrap,
}))`
  ${({ columnHeight, minColumnHeight, spacing = 0 }) => css`
    display: flex;
    gap: ${resolveSpacing(spacing)};

    > ${HoneyGridColumnStyled} {
      height: ${columnHeight};
      min-height: ${minColumnHeight};
    }
  `}
`;
