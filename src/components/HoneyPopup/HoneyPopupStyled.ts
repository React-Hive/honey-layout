import styled from 'styled-components';
import type { HTMLAttributes } from 'react';

import { HoneyFlexBox } from '../HoneyFlexBox';
import type { HoneyFlexBoxProps } from '../HoneyFlexBox';

export interface HoneyPopupStyledProps extends HTMLAttributes<HTMLDivElement>, HoneyFlexBoxProps {}

export const HoneyPopupStyled = styled(HoneyFlexBox).attrs(({ $width = 'max-content' }) => ({
  $width,
}))<HoneyPopupStyledProps>``;
