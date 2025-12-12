import { css, styled } from '@react-hive/honey-style';

import { HoneyFlex } from '../../components';

export const HoneyContainer = styled(HoneyFlex)`
  ${({ theme }) => css`
    width: 100%;
    max-width: ${theme.container.maxWidth};
    height: min-content;

    margin: 0 auto;
    padding: 16px;

    overflow: hidden;
  `}
`;
