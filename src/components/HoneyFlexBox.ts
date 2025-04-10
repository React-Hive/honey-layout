import styled from 'styled-components';
import type { ElementType } from 'react';

import { HoneyBox } from './HoneyBox';
import type { HoneyBoxProps } from './HoneyBox';

export type HoneyFlexBoxProps<Element extends ElementType = 'div'> = HoneyBoxProps<Element>;

export const HoneyFlexBox = styled(HoneyBox).attrs<HoneyFlexBoxProps>(
  ({ $display = 'flex', $flexDirection = 'column' }) => ({
    $display,
    $flexDirection,
  }),
)``;
