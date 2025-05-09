import { styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

import { HoneyBox } from './HoneyBox';
import type { HoneyBoxProps } from './HoneyBox';

export type HoneyFlexBoxProps<Element extends ElementType = 'div'> = HoneyBoxProps<Element>;

export const HoneyFlexBox = styled<HoneyFlexBoxProps>(
  HoneyBox,
  ({ $display = 'flex', $flexDirection = 'column' }) => ({
    $display,
    $flexDirection,
  }),
)``;
