import React from 'react';
import type { PropsWithChildren } from 'react';
import styled, { css, useTheme } from 'styled-components';

import type { HoneyBreakpointName } from '../../types';
import { useHoneyLayout } from '../../hooks';
import { HoneyBox } from '../../components';

const StyledDemoContainer = styled(HoneyBox)`
  ${({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    padding: 8px;

    border: 1px solid #cccccc;
    border-radius: 4px;
  `}
`;

export const DemoContainer = ({ children }: PropsWithChildren) => {
  const theme = useTheme();
  const { screenState } = useHoneyLayout();

  const getBreakpointInfo = (breakpoint: HoneyBreakpointName) => {
    const size = theme.breakpoints[breakpoint];

    return `${breakpoint}[${size}px]`;
  };

  return (
    <>
      <HoneyBox
        $display="flex"
        $flexWrap="wrap"
        $gap="8px"
        $margin="0 auto"
        $color={theme.colors.neutral.goldenrod}
      >
        <span>
          {getBreakpointInfo('xs')}: {screenState.isXs.toString()}
        </span>
        <span>
          {getBreakpointInfo('sm')}: {screenState.isSm.toString()}
        </span>
        <span>
          {getBreakpointInfo('md')}: {screenState.isMd.toString()}
        </span>
        <span>
          {getBreakpointInfo('lg')}: {screenState.isLg.toString()}
        </span>
        <span>
          {getBreakpointInfo('xl')}: {screenState.isXl.toString()}
        </span>
      </HoneyBox>

      <StyledDemoContainer $marginTop="4px">{children}</StyledDemoContainer>
    </>
  );
};
