import styled, { css } from 'styled-components';

import { resolveColor, resolveSpacing } from '../../../../helpers';
import { HoneyBox } from '../../../../components';
import type { HoneyColorKey } from '../../../../types';
import type { HoneyBoxProps } from '../../../../components';

type ButtonColorType = 'success' | 'default';

interface ButtonColorConfig {
  main: HoneyColorKey;
  hover: HoneyColorKey;
  active: HoneyColorKey;
}

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

type ButtonProps = Omit<HoneyBoxProps<'button'>, 'color'> & {
  color?: ButtonColorType;
};

export const Button = styled(HoneyBox).attrs<ButtonProps>({
  as: 'button',
})`
  ${({ color = 'success' }) => {
    const colorConfig = BUTTON_COLORS_MAP[color];

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
