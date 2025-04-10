import styled, { css } from 'styled-components';
import type { ComponentPropsWithRef, ElementType } from 'react';

import { applyBreakpointStyles, createStyles } from '../helpers';
import type { HoneyPrefixedCSSProperties, HoneyEffectResultFn } from '../types';

export type HoneyBoxProps<Element extends ElementType = 'div'> = ComponentPropsWithRef<Element> &
  HoneyPrefixedCSSProperties & {
    as?: Element;
    effects?: HoneyEffectResultFn<object>[];
  };

export const HoneyBox = styled.div<HoneyBoxProps>`
  ${({ effects }) => css`
    ${effects};

    ${createStyles('xs')};

    ${applyBreakpointStyles('sm')};
    ${applyBreakpointStyles('md')};
    ${applyBreakpointStyles('lg')};
    ${applyBreakpointStyles('xl')};
  `}
`;
