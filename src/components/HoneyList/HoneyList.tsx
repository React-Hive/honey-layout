import React, { Fragment } from 'react';
import styled from 'styled-components';

import type { ComponentWithAs, HoneyStatusContentOptions } from '../../types';
import type { HoneyListGenericProps, HoneyListItem } from './HoneyList.types';
import type { HoneyBoxProps } from '../HoneyBox';
import { HoneyBox } from '../HoneyBox';
import { HoneyStatusContent } from '../HoneyStatusContent';
import { getHoneyListItemId } from './HoneyList.helpers';

const HoneyListStyled = styled(HoneyBox)`
  overflow: hidden auto;
`;

type HoneyListProps<Item extends HoneyListItem> = HoneyBoxProps &
  HoneyListGenericProps<Item, Omit<HoneyStatusContentOptions, 'isNoContent'>>;

/**
 * A generic and reusable list component that handles various states (loading, error, no content)
 * and renders a list of items with custom content.
 *
 * @template Item - The type of the items to be rendered in the list.
 */
export const HoneyList = <Item extends HoneyListItem>({
  children,
  items,
  itemKey,
  isLoading,
  loadingContent,
  isError,
  errorContent,
  noContent,
  ...boxProps
}: ComponentWithAs<HoneyListProps<Item>>) => {
  return (
    <HoneyListStyled role="list" aria-busy={isLoading} data-testid="honey-list" {...boxProps}>
      <HoneyStatusContent
        isLoading={isLoading}
        loadingContent={loadingContent}
        isError={isError}
        errorContent={errorContent}
        isNoContent={items?.length === 0}
        noContent={noContent}
      >
        {items?.map((item, itemIndex, thisItems) => (
          <Fragment key={String(getHoneyListItemId(item, itemKey, itemIndex))}>
            {children(item, itemIndex, thisItems)}
          </Fragment>
        ))}
      </HoneyStatusContent>
    </HoneyListStyled>
  );
};
