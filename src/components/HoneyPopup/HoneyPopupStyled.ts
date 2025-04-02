import type { HTMLAttributes } from 'react';
import styled from 'styled-components';

import type { HoneyFlexBoxProps } from '../HoneyFlexBox';
import { HoneyFlexBox } from '../HoneyFlexBox';

export interface HoneyPopupStyledProps extends HTMLAttributes<HTMLDivElement>, HoneyFlexBoxProps {}

export const HoneyPopupStyled = styled(HoneyFlexBox).attrs(({ $width = 'max-content' }) => ({
  $width,
}))<HoneyPopupStyledProps>``;
