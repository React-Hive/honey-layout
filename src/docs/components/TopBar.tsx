import React from 'react';

import { IconButton } from './IconButton';
import { MenuIcon } from '../icons';
import { HoneyBox } from '../../components';
import { useCurrentApp } from '../providers';
import { useHoneyLayout } from '../../hooks';

export const TopBar = () => {
  const { theme } = useHoneyLayout();
  const { toggleMenu } = useCurrentApp();

  return (
    <HoneyBox
      $display="flex"
      $padding="16px"
      $backgroundColor={theme.colors.neutral.charcoalDark}
      $boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
      $zIndex={99}
      // Data
      data-testid="top-bar"
    >
      <IconButton onClick={toggleMenu}>
        <MenuIcon $color="white" />
      </IconButton>
    </HoneyBox>
  );
};
