import type { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import type { HoneyCSSProperties, HoneyModifierResultFn } from '../types';
import { generateMediaStyles, generateStyles } from '../helpers';

export type HoneyBoxProps = HoneyCSSProperties & {
  modifiers?: HoneyModifierResultFn[];
};

export const HoneyBox = styled.div<HTMLAttributes<HTMLDivElement> & HoneyBoxProps>`
  ${({ modifiers }) => css`
    ${modifiers?.map(modifier => modifier())};

    ${generateStyles('xs')};

    ${generateMediaStyles('sm')};
    ${generateMediaStyles('md')};
    ${generateMediaStyles('lg')};
    ${generateMediaStyles('xl')};
  `}
`;
