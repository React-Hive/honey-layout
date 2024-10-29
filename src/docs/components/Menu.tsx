import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { PAGES } from '../constants';
import { useCurrentApp } from '../providers';
import { bpMedia, resolveSpacing } from '../../helpers';
import { useHoneyLayout } from '../../providers';

type MenuStyledProps = {
  isOpenMenu: boolean;
};

const MenuStyled = styled.div<MenuStyledProps>`
  ${({ isOpenMenu, theme }) => css`
    position: relative;

    display: flex;
    flex-shrink: 0;

    height: 100%;

    transition: all 200ms ease-in-out;
    background-color: ${theme.colors.neutral.charcoalGray};
    overflow: hidden auto;

    ${isOpenMenu
      ? css`
          width: 300px;
          padding: 16px;
        `
      : css`
          width: 0;
          padding: 0;
        `}

    ${bpMedia('xs').down} {
      width: ${isOpenMenu && '100%'};
    }

    ${bpMedia('xs').up} {
      border-right: 1px solid ${theme.colors.neutral.charcoalDark};
    }

    ${bpMedia('sm').down} {
      position: absolute;
      z-index: 999;
    }
  `}
`;

const List = styled.ul`
  width: 100%;

  margin: 0;
  padding: 0;

  list-style-type: none;
  overflow: hidden;
`;

const ListItem = styled.li`
  ${({ theme: { colors } }) => css`
    margin: ${resolveSpacing([0.5, 0])};

    font-size: 18px;
    border-radius: 4px;
    color: ${colors.neutral.lightBlue};

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    a {
      display: block;

      width: 100%;
      padding: 8px 16px;

      &.active {
        background-color: ${colors.neutral.charcoalDark};
      }
    }

    &:hover {
      background-color: ${colors.neutral.charcoalDark};
    }
  `}
`;

export const Menu = () => {
  const { screenState } = useHoneyLayout();

  const { isOpenMenu, toggleMenu } = useCurrentApp();

  const handleOnClickMenuItem = () => {
    if (screenState.isXs || screenState.isSm) {
      toggleMenu();
    }
  };

  return (
    <MenuStyled isOpenMenu={isOpenMenu}>
      <List>
        {PAGES.map(page => (
          <ListItem key={page.path}>
            <NavLink onClick={handleOnClickMenuItem} to={page.path}>
              {page.menuLabel}
            </NavLink>
          </ListItem>
        ))}
      </List>
    </MenuStyled>
  );
};
