import { HONEY_BREAKPOINTS, styled, css } from '@react-hive/honey-style';
import type { ElementType } from 'react';
import type { HoneyBreakpointName, HoneyStyledProps } from '@react-hive/honey-style';

import { applyBreakpointStyles, createStyles } from '../../helpers';
import type { Honey$PrefixedCSSProperties, HoneyEffectResultFn } from '../../types';

const applyResponsiveStyles = (breakpoint: HoneyBreakpointName) =>
  breakpoint === 'xs' ? createStyles(breakpoint) : applyBreakpointStyles(breakpoint);

export type HoneyBoxProps<Element extends ElementType = 'div'> = HoneyStyledProps<
  Element,
  Honey$PrefixedCSSProperties & {
    effects?: HoneyEffectResultFn<object>[];
  }
>;

export const HoneyBox = styled<HoneyBoxProps>('div', props => ({
  'data-testid': props['data-testid'] ?? 'honey-box',
}))`
  ${({ effects }) => css`
    ${effects};

    ${HONEY_BREAKPOINTS.map(applyResponsiveStyles)};
  `}
`;
