import { styled } from '@react-hive/honey-style';

import { HoneyFlexBox } from '../HoneyFlexBox';
import type { HoneyFlexBoxProps } from '../HoneyFlexBox';

export type HoneyPopupStyledProps = HoneyFlexBoxProps;

export const HoneyPopupStyled = styled<HoneyPopupStyledProps>(
  HoneyFlexBox,
  ({ $width = 'max-content' }) => ({
    $width,
  }),
)``;
