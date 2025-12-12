import { styled } from '@react-hive/honey-style';

import { HoneyFlex } from '../HoneyFlex';
import type { HoneyFlexProps } from '../HoneyFlex';

export type HoneyPopupStyledProps = HoneyFlexProps;

export const HoneyPopupStyled = styled<HoneyPopupStyledProps>(
  HoneyFlex,
  ({ $width = 'max-content' }) => ({
    $width,
  }),
)``;
