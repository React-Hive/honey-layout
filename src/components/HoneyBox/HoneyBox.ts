import styled, { css } from 'styled-components';
import type { DataAttributes } from 'styled-components';
import type { ComponentPropsWithRef, ElementType } from 'react';

import { applyBreakpointStyles, createStyles } from '../../helpers';
import type { HoneyPrefixedCSSProperties, HoneyEffectResultFn } from '../../types';

export type HoneyBoxProps<Element extends ElementType = 'div'> = DataAttributes &
  ComponentPropsWithRef<Element> &
  HoneyPrefixedCSSProperties & {
    as?: Element;
    effects?: HoneyEffectResultFn<object>[];
  };

export const HoneyBox = styled.div.attrs<HoneyBoxProps>(props => ({
  'data-testid': props['data-testid'] ?? 'honey-box',
}))`
  ${({ effects }) => css`
    ${effects};

    ${createStyles('xs')};

    ${applyBreakpointStyles('sm')};
    ${applyBreakpointStyles('md')};
    ${applyBreakpointStyles('lg')};
    ${applyBreakpointStyles('xl')};
  `}
`;
