import { css, styled, resolveSpacing } from '@react-hive/honey-style';

export const MDXWrapper = styled('div')`
  ${({ theme }) => css`
    font-size: 18px;
    letter-spacing: 0.025rem;
    line-height: 2rem;

    color: ${theme.colors.neutral.lightGray};

    h2 {
      margin-top: ${resolveSpacing(8)};
    }

    h3 {
      position: relative;

      margin: ${resolveSpacing([5, 0, 0])};
      padding-left: ${resolveSpacing(2)};

      &:before {
        position: absolute;
        content: '|';

        top: -2px;
        left: 0;
        margin-right: ${resolveSpacing(1)};

        font-weight: bold;
        font-size: 2.5rem;
      }
    }
  `}
`;
