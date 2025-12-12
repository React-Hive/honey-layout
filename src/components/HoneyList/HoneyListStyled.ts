import { styled } from '@react-hive/honey-style';

import { HoneyFlex } from '../HoneyFlex';
import type { HoneyFlexProps } from '../HoneyFlex';

export type HoneyListStyledProps = HoneyFlexProps;

export const HoneyListStyled = styled<HoneyListStyledProps>(
  HoneyFlex,
  ({ $overflow = 'hidden auto' }) => ({
    $overflow,
  }),
)``;
