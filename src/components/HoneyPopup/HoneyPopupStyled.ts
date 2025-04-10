import styled from 'styled-components';

import { HoneyFlexBox } from '../HoneyFlexBox';
import type { HoneyFlexBoxProps } from '../HoneyFlexBox';

export type HoneyPopupStyledProps = HoneyFlexBoxProps;

export const HoneyPopupStyled = styled(HoneyFlexBox).attrs<HoneyPopupStyledProps>(
  ({ $width = 'max-content' }) => ({
    $width,
  }),
)``;
