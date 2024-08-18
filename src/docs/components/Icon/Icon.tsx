import React from 'react';

import type { PropsWithChildren } from 'react';
import type { IconStyledProps } from './IconStyled';

import { IconStyled } from './IconStyled';

export type IconProps = IconStyledProps;

export const Icon = ({ children, ...props }: PropsWithChildren<IconProps>) => {
  return (
    <IconStyled xmlns="http://www.w3.org/2000/svg" focusable={false} aria-hidden {...props}>
      {children}
    </IconStyled>
  );
};
