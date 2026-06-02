import { css, HONEY_BREAKPOINTS, styled } from '@react-hive/honey-style';
import type { ComponentPropsWithRef, ElementType } from 'react';
import type {
  HoneyHtmlDataAttributes,
  HoneyStyledPropsWithAs,
  HoneyBreakpointName,
} from '@react-hive/honey-style';

import { applyBreakpointStyles, createStyles } from '../../helpers';
import type { HoneyPrefixedCssProperties, HoneyEffectResultFn } from '../../types';

type HoneyStyledProps<Element extends ElementType, Props extends object> = HoneyStyledPropsWithAs<
  Element,
  HoneyHtmlDataAttributes & ComponentPropsWithRef<Element> & Props
>;

const applyResponsiveStyles = (breakpoint: HoneyBreakpointName) =>
  breakpoint === 'xs' ? createStyles(breakpoint) : applyBreakpointStyles(breakpoint);

export type HoneyBoxProps<Element extends ElementType = 'div'> = HoneyStyledProps<
  Element,
  HoneyPrefixedCssProperties & {
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
