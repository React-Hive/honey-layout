import * as CSS from 'csstype';
import styled, { css } from 'styled-components';

import type { SVGAttributes } from 'react';

export type IconSize = 'small' | 'medium' | 'large';

export type IconStyledProps = SVGAttributes<SVGElement> & {
  $size?: IconSize;
  $color?: CSS.Properties['color'];
  $rotate?: number;
};

const iconSizes: Record<IconSize, string> = {
  small: '16px',
  medium: '20px',
  large: '24px',
};

export const IconStyled = styled.svg<IconStyledProps>`
  ${({ width, height, $color, $size = 'medium', $rotate, stroke, scale }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    transition: all 0.3s linear;

    width: ${width ?? iconSizes[$size]};
    height: ${height ?? iconSizes[$size]};

    transform: ${$rotate && `rotate(${$rotate}deg)`} scale(${scale || 1});

    &,
    path,
    rect {
      stroke: ${stroke};
      fill: ${$color};
    }
  `};
`;
