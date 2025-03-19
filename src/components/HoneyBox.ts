import type { HTMLAttributes } from 'react';
import type { StyledTarget } from 'styled-components/dist/types';
import styled, { css } from 'styled-components';

import type { HoneyPrefixedCSSProperties, HoneyEffectResultFn } from '../types';
import { applyBreakpointStyles, createStyles } from '../helpers';

export interface HoneyBoxProps extends HoneyPrefixedCSSProperties {
  as?: StyledTarget<'web'>;
  effects?: HoneyEffectResultFn<object>[];
}

type HoneyBoxInnerProps = HTMLAttributes<HTMLDivElement> & HoneyBoxProps;

export const HoneyBox = styled.div<HoneyBoxInnerProps>`
  ${({ effects }) => css`
    ${effects};

    ${createStyles('xs')};

    ${applyBreakpointStyles('sm')};
    ${applyBreakpointStyles('md')};
    ${applyBreakpointStyles('lg')};
    ${applyBreakpointStyles('xl')};
  `}
`;
