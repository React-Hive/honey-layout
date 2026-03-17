import type { HoneyBreakpointName, HoneyStyledProps } from '@react-hive/honey-style';
import { css, HONEY_BREAKPOINTS, styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

import { applyBreakpointStyles, createStyles } from '../../helpers';
import type { Honey$PrefixedCssProperties, HoneyEffectResultFn } from '../../types';

const applyResponsiveStyles = (breakpoint: HoneyBreakpointName) =>
  breakpoint === 'xs' ? createStyles(breakpoint) : applyBreakpointStyles(breakpoint);

export type HoneyBoxProps<Element extends ElementType = 'div'> = HoneyStyledProps<
  Element,
  Honey$PrefixedCssProperties & {
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
