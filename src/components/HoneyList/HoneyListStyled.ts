import { styled } from '@react-hive/honey-style';

import { HoneyFlexBox } from '../HoneyFlexBox';
import type { HoneyFlexBoxProps } from '../HoneyFlexBox';

export type HoneyListStyledProps = HoneyFlexBoxProps;

export const HoneyListStyled = styled<HoneyListStyledProps>(
  HoneyFlexBox,
  ({ $overflow = 'hidden auto' }) => ({
    $overflow,
  }),
)``;
