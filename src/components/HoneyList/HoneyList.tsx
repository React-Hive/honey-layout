import type { Ref, RefAttributes } from 'react';
import React, { forwardRef, Fragment } from 'react';

import type { HoneyStatusContentOptions } from '../../types';
import type { HoneyListGenericProps, HoneyListItem } from './HoneyList.types';
import type { HoneyBoxProps } from '../HoneyBox';
import { HoneyStatusContent } from '../HoneyStatusContent';
import { getHoneyListItemId } from './HoneyList.helpers';
import { HoneyListStyled } from './HoneyList.styled';

type HoneyListProps<Item extends HoneyListItem> = HoneyBoxProps &
  HoneyListGenericProps<Item, Omit<HoneyStatusContentOptions, 'isNoContent'>>;

/**
 * A generic and reusable list component that handles different states such as loading, error, or no content,
 * and dynamically renders a list of items with custom content for each item.
 *
 * This component provides a flexible and accessible way to display lists, with built-in support for
 * various states to enhance user experience. It accepts a `ref` to access the underlying HTML element
 * for greater control and customization.
 *
 * @template Item - Represents the type of the items to be rendered in the list. This allows the component
 * to be used with any item type, making it highly versatile.
 *
 * @template Element - Represents the type of the HTML element (e.g., `HTMLDivElement`, `HTMLUListElement`)
 * that will receive the forwarded ref. This allows precise typing for the element, enhancing TypeScript support.
 */
const HoneyListComponent = <Item extends HoneyListItem, Element extends HTMLElement>(
  {
    children,
    items,
    itemKey,
    isLoading,
    loadingContent,
    isError,
    errorContent,
    noContent,
    ...props
  }: HoneyListProps<Item>,
  ref: Ref<Element>,
) => {
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

/**
 * The `HoneyList` is a forward-ref component that renders a list of items
 * and allows a ref to be forwarded to the underlying DOM element.
 *
 * @template Item - Represents the type of items to be rendered in the list.
 * @template Element - Represents the type of the HTML element that will receive the ref.
 */
export const HoneyList = forwardRef(HoneyListComponent) as <
  Item extends HoneyListItem,
  Element extends HTMLElement,
>(
  props: HoneyListProps<Item> & RefAttributes<Element>,
) => React.ReactElement;
