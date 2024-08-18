import styled, { css } from 'styled-components';

export const HoneyContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;

    width: 100%;
    max-width: ${theme.container.maxWidth};
    height: min-content;

    margin: 0 auto;
    padding: 16px;

    overflow: hidden;
  `}
`;
