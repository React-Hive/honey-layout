import type { ReactNode } from 'react';

export type HoneyListItem = object | string | number;

export type HoneyListItemKey<Item extends HoneyListItem> = ((item: Item) => string) | keyof Item;

export type HoneyListItemId<Item extends HoneyListItem> = Item[keyof Item] | string | number;

/**
 * Generic props for HoneyList component.
 *
 * @template Item - The type of the items to be rendered in the list.
 * @template T - Additional props type.
 */
export type HoneyListGenericProps<Item extends HoneyListItem, T = unknown> = {
  /**
   * Function to render each item in the list.
   *
   * @param {Item} item - The current item to be rendered.
   * @param {number} itemIndex - The index of the current item.
   * @param {Item[]} thisItems - The array of all items.
   *
   * @returns {ReactNode} - The node to be rendered for each item.
   */
  children: (item: Item, itemIndex: number, thisItems: Item[]) => ReactNode;
  /**
   * The array of items to be displayed in the list.
   *
   * @type {Item[] | undefined}
   */
  items: Item[] | undefined;
  /**
   * Optional function or key to uniquely identify each item in the list.
   *
   * @type {HoneyListItemKey<Item>}
   */
  itemKey?: HoneyListItemKey<Item>;
} & T;
