import React from 'react';
import styled from 'styled-components';

import { resolveColor } from '../../../helpers';
import { HoneyLoopingList, HoneyLoopingListStyled } from '../../../components';

const HoneyLoopingListBasicExampleStyled = styled.div`
  padding: 8px;

  border-radius: 4px;
  border: 1px solid ${resolveColor('neutral.charcoalDark')};

  ${HoneyLoopingListStyled} {
    padding: 0;
    list-style-type: none;

    user-select: none;

    > * {
      padding: 4px 8px;
      border-radius: 4px;

      font-size: 1rem;

      &[aria-current='true'] {
        font-weight: bold;
        font-size: 1.3rem;

        background-color: ${resolveColor('neutral.charcoalDark')};
      }
    }
  }
`;

export const HoneyLoopingListBasicExample = () => {
  const items = Array.from(Array(12)).map((_, index) => index + 1);

  return (
    <HoneyLoopingListBasicExampleStyled>
      <HoneyLoopingList
        items={items}
        itemKey={item => item.toString()}
        activeItemIndex={Math.floor(items.length / 2)}
        $maxHeight="250px"
      >
        {item => item}
      </HoneyLoopingList>
    </HoneyLoopingListBasicExampleStyled>
  );
};
