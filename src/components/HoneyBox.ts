import type { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import type { HoneyCSSProperties, HoneyModifierResultFn } from '../types';
import { generateMediaStyles, generateStyles } from '../helpers';
import { HTML_ATTRIBUTES } from '../constants';

export type HoneyBoxProps<Element extends HTMLElement> = HTMLAttributes<Element> &
  HoneyCSSProperties & {
    modifiers?: HoneyModifierResultFn[];
  };

export const HoneyBox = styled.div.withConfig({
  shouldForwardProp: prop =>
    HTML_ATTRIBUTES.includes(prop as never) ||
    prop.startsWith('on') ||
    prop.startsWith('data-') ||
    prop.startsWith('aria-'),
})<HoneyBoxProps<HTMLDivElement>>`
  ${({ modifiers }) => css`
    ${modifiers?.map(modifier => modifier())};

    ${generateStyles('xs')};

    ${generateMediaStyles('sm')};
    ${generateMediaStyles('md')};
    ${generateMediaStyles('lg')};
    ${generateMediaStyles('xl')};
  `}
`;
