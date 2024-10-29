import styled, { css } from 'styled-components';

import { HoneyFlexBox } from '../../components';

export const HoneyContainer = styled(HoneyFlexBox)`
  ${({ theme }) => css`
    width: 100%;
    max-width: ${theme.container.maxWidth};
    height: min-content;

    margin: 0 auto;
    padding: 16px;

    overflow: hidden;
  `}
`;
