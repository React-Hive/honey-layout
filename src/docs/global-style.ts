import { createGlobalStyle, css } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  ${({ theme }) => css`
    html {
      background-color: ${theme.colors.neutral.charcoalGray};
    }

    body {
      margin: 0;
      padding: 0;

      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-style: normal;
      line-height: 1.2rem;
    }

    html,
    body,
    #root {
      height: 100%;
      min-height: 100%;
    }

    a,
    a:hover,
    a:focus,
    a:active {
      text-decoration: none;
      color: inherit;
    }

    html {
      box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    pre {
      font-family: 'Roboto', sans-serif;
      line-height: 1.5rem;

      border-radius: 4px;
      overflow: hidden;
    }

    code {
      padding: 2px 4px;
      border-radius: 4px;

      background-color: #22272e;
    }

    #root {
      display: flex;
      flex-direction: column;
    }
  `}
`;
