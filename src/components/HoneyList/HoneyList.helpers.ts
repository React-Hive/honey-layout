import type { HoneyListItem, HoneyListItemId, HoneyListItemKey } from './HoneyList.types';

export const getHoneyListItemId = <Item extends HoneyListItem>(
  item: Item,
  itemKey: HoneyListItemKey<Item> | undefined,
  itemIndex: number,
): HoneyListItemId<Item> => {
  if (typeof itemKey === 'function') {
    return itemKey(item);
  }

  if (typeof item === 'string' || typeof item === 'number') {
    return item;
  }

  return itemKey ? item[itemKey] : itemIndex;
};
