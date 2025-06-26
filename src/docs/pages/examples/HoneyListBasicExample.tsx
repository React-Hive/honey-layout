import React from 'react';
import { css, resolveSpacing, styled } from '@react-hive/honey-style';

import { HoneyBox, HoneyList } from '../../../components';

export const ListItem = styled('li')`
  ${({ theme: { colors } }) => css`
    padding: ${resolveSpacing([0, 1])};

    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: ${colors.neutral.charcoalDark};
    }
  `}
`;

export const HoneyListBasicExample = () => {
  const items = Array.from(Array(5)).map((_, index) => ({
    id: index,
    name: `name-${index}`,
  }));

  return (
    <HoneyBox $marginTop="16px" $border="1px solid #cccccc" $borderRadius="4px">
      <HoneyList items={items} itemKey="id" $gap="8px">
        {item => <ListItem>{item.name}</ListItem>}
      </HoneyList>
    </HoneyBox>
  );
};
