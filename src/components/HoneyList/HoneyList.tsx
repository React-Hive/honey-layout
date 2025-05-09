import React, { Fragment } from 'react';
import type { FastOmit } from '@react-hive/honey-style';

import { HoneyStatusContent } from '../HoneyStatusContent';
import { getHoneyListItemId } from './HoneyList.helpers';
import { HoneyListStyled } from './HoneyListStyled';
import type { HoneyListGenericProps, HoneyListItem } from './HoneyList.types';
import type { HoneyStatusContentProps } from '../HoneyStatusContent';
import type { HoneyListStyledProps } from './HoneyListStyled';

export type HoneyListProps<Item extends HoneyListItem> = FastOmit<
  HoneyListStyledProps,
  'children'
> &
  HoneyListGenericProps<Item> &
  FastOmit<HoneyStatusContentProps, 'isNoContent'>;

/**
 * A generic and reusable list component that handles different states such as loading, error, or no content,
 * and dynamically renders a list of items with custom content for each item.
 *
 * This component provides a flexible and accessible way to display lists, with built-in support for
 * various states to enhance user experience. It accepts a `ref` to access the underlying HTML element
 * for greater control and customization.
 *
 * @template Item - Represents the type of the items to be rendered in the list. This allows the component
 * to be used with any item type.
 */
export const HoneyList = <Item extends HoneyListItem>({
  ref,
  children,
  items,
  itemKey,
  isLoading,
  isLoadingOverContent,
  loadingContent,
  isError,
  errorContent,
  noContent,
  ...props
}: HoneyListProps<Item>) => {
  return (
    <HoneyListStyled
      ref={ref}
      role="list"
      // ARIA
      aria-busy={isLoading}
      // Data
      data-testid="honey-list"
      {...props}
    >
      <HoneyStatusContent
        isLoading={isLoading}
        isLoadingOverContent={isLoadingOverContent}
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
