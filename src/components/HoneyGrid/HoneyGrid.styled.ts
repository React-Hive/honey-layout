import type { HTMLAttributes } from 'react';
import * as CSS from 'csstype';
import styled, { css } from 'styled-components';

import type { HoneyBoxProps } from '../HoneyBox';
import { resolveSpacing } from '../../helpers';
import { HoneyBox } from '../HoneyBox';
import { HoneyGridColumnStyled } from '../HoneyGridColumn/HoneyGridColumn.styled';

export type HoneyGridStyledProps = HTMLAttributes<HTMLDivElement> &
  HoneyBoxProps & {
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
  };

export const HoneyGridStyled = styled(HoneyBox)<HoneyGridStyledProps>`
  ${({ columnHeight, minColumnHeight, spacing = 0 }) => css`
    display: flex;
    gap: ${resolveSpacing(spacing)};

    > ${HoneyGridColumnStyled} {
      height: ${columnHeight};
      min-height: ${minColumnHeight};
    }
  `}
`;

HoneyGridStyled.defaultProps = {
  $flexWrap: 'wrap',
};
