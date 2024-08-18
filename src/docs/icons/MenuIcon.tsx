import React from 'react';

import type { IconProps } from '../components';

import { Icon } from '../components/Icon';

export const MenuIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
  </Icon>
);
