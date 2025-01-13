import type { HTMLAttributes } from 'react';
import type { StyledTarget } from 'styled-components/dist/types';
import styled, { css } from 'styled-components';

import type { HoneyPrefixedCSSProperties, HoneyEffectResultFn } from '../types';
import { applyBreakpointStyles, createStyles } from '../helpers';

export type HoneyBoxProps = HoneyPrefixedCSSProperties & {
  as?: StyledTarget<'web'>;
  effects?: HoneyEffectResultFn<object>[];
};

export const HoneyBox = styled.div<HTMLAttributes<HTMLDivElement> & HoneyBoxProps>`
  ${({ effects }) => css`
    ${effects};

    ${createStyles('xs')};

    ${applyBreakpointStyles('sm')};
    ${applyBreakpointStyles('md')};
    ${applyBreakpointStyles('lg')};
    ${applyBreakpointStyles('xl')};
  `}
`;
