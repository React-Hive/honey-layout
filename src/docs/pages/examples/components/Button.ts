import type { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import type { HoneyColorKey } from '../../../../types';
import { resolveColor, resolveSpacing } from '../../../../helpers';

type ButtonColorType = 'success' | 'default';

type ButtonColorConfig = {
  main: HoneyColorKey;
  hover: HoneyColorKey;
  active: HoneyColorKey;
};

const BUTTON_COLORS_MAP: Record<ButtonColorType, ButtonColorConfig> = {
  success: {
    main: 'neutral.forestGreen',
    hover: 'neutral.forestGreenLight',
    active: 'neutral.forestGreenDark',
  },
  default: {
    main: 'neutral.lightGray',
    hover: 'neutral.lightBlue',
    active: 'neutral.lightGray',
  },
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  $color?: ButtonColorType;
};

export const Button = styled.button<ButtonProps>`
  ${({ $color = 'success' }) => {
    const colorConfig = BUTTON_COLORS_MAP[$color];

    return css`
      padding: ${resolveSpacing(1)};

      border: 0;
      border-radius: 4px;
      background-color: ${resolveColor(colorConfig.main)};
      cursor: pointer;

      &:hover {
        background-color: ${resolveColor(colorConfig.hover)};
      }

      &:active {
        background-color: ${resolveColor(colorConfig.active)};
      }
    `;
  }}
`;
