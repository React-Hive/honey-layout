import type { HTMLAttributes, Ref, RefAttributes } from 'react';
import React, { forwardRef, Fragment } from 'react';

import type { HoneyListGenericProps, HoneyListItem } from './HoneyList.types';
import type { HoneyBoxProps } from '../HoneyBox';
import type { HoneyStatusContentProps } from '../HoneyStatusContent';
import { HoneyStatusContent } from '../HoneyStatusContent';
import { getHoneyListItemId } from './HoneyList.helpers';
import { HoneyListStyled } from './HoneyListStyled';

export interface HoneyListProps<Item extends HoneyListItem>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    HoneyBoxProps,
    HoneyListGenericProps<Item>,
    Omit<HoneyStatusContentProps, 'isNoContent'> {}

const HoneyListComponent = <Item extends HoneyListItem, Element extends HTMLElement>(
  {
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
 *
 * @template Element - Represents the type of the HTML element (e.g., `HTMLDivElement`, `HTMLUListElement`)
 * that will receive the forwarded ref. This allows precise typing for the element.
 */
export const HoneyList = forwardRef(HoneyListComponent) as <
  Item extends HoneyListItem,
  Element extends HTMLElement,
>(
  props: HoneyListProps<Item> & RefAttributes<Element>,
) => React.ReactElement;
