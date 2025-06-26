import React from 'react';
import { css } from '@react-hive/honey-style';

import { HoneyBox } from '../../../components';
import type { HoneyEffect } from '../../../types';

const hoverableEffect: HoneyEffect =
  () =>
  ({ theme: { colors } }) => css`
    &:hover {
      background-color: ${colors.neutral.coralRed};
    }
  `;

export const HoneyEffectsBasicExample = () => {
  return (
    <HoneyBox
      effects={[hoverableEffect({})]}
      $width="100px"
      $height="100px"
      $margin={[0, 'auto']}
      $backgroundColor="neutral.forestGreen"
    />
  );
};
