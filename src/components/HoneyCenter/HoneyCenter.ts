import { styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

import type { HoneyFlexProps } from '../HoneyFlex';
import { HoneyFlex } from '../HoneyFlex';

export type HoneyCenterProps<Element extends ElementType = 'div'> = HoneyFlexProps<Element>;

export const HoneyCenter = styled<HoneyCenterProps>(
  HoneyFlex,
  ({ $alignItems = 'center', $justifyContent = 'center', ...props }) => ({
    $alignItems,
    $justifyContent,
    // Data
    'data-testid': props['data-testid'] ?? 'honey-center',
  }),
)``;
