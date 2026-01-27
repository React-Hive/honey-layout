import React from 'react';
import { useHoneyStyle } from '@react-hive/honey-style';

import { HoneyBox } from '~/components';

export const HoneyBoxBasicExample = () => {
  const {
    theme: { colors },
    resolveColor,
  } = useHoneyStyle();

  return (
    <HoneyBox
      $width="100px"
      $height="100px"
      $margin={[0, 'auto']}
      $backgroundColor={{
        xs: 'white',
        sm: colors.neutral.forestGreen,
        md: 'neutral.forestGreen',
        // You can use `resolveColor` function to get a color value
        lg: resolveColor('neutral.crimsonRed'),
      }}
    />
  );
};
