import type { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import type { HoneyPrefixedCSSProperties, HoneyModifierResultFn } from '../types';
import { applyBreakpointStyles, createStyles } from '../helpers';

export type HoneyBoxProps = HoneyPrefixedCSSProperties & {
  modifiers?: HoneyModifierResultFn<object>[];
};

export const HoneyBox = styled.div<HTMLAttributes<HTMLDivElement> & HoneyBoxProps>`
  ${({ modifiers }) => css`
    ${modifiers};

    ${createStyles('xs')};

    ${applyBreakpointStyles('sm')};
    ${applyBreakpointStyles('md')};
    ${applyBreakpointStyles('lg')};
    ${applyBreakpointStyles('xl')};
  `}
`;
