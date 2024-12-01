import React from 'react';
import { css } from 'styled-components';

import type { HoneyModifier } from '../../../types';
import { HoneyBox } from '../../../components';

const hoverableModifier: HoneyModifier =
  () =>
  ({ theme: { colors } }) => css`
    &:hover {
      background-color: ${colors.neutral.coralRed};
    }
  `;

export const HoneyModifiersBasicExample = () => {
  return (
    <HoneyBox
      modifiers={[hoverableModifier({})]}
      $width="100px"
      $height="100px"
      $margin="0 auto"
      $backgroundColor="neutral.forestGreen"
    />
  );
};
