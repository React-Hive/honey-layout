import styled from 'styled-components';

import { HoneyFlexBox } from '../HoneyFlexBox';
import type { HoneyFlexBoxProps } from '../HoneyFlexBox';

export type HoneyListStyledProps = HoneyFlexBoxProps;

export const HoneyListStyled = styled(HoneyFlexBox).attrs<HoneyListStyledProps>(
  ({ $overflow = 'hidden auto' }) => ({
    $overflow,
  }),
)``;
