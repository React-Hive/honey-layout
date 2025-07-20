import { splitStringIntoWords } from '@react-hive/honey-utils';

import type {
  HoneyFlattenedItem,
  KeysWithArrayValues,
  KeysWithNonArrayValues,
  KeysWithStringValues,
} from '../types';

/**
 * Recursively converts a nested list structure into a flat list. It excludes the nested list key from the result
 * while adding hierarchical metadata, such as `depthLevel`, `parentId`, and `totalNestedItems` to each flattened item.
 *
 * This function is useful for flattening deeply nested tree-like structures (e.g., categories, folders)
 * while preserving their relationships and depth levels in the hierarchy.
 *
 * @template OriginItem - The type of the items in the nested list.
 *
 * @param items - The array of items to be flattened. If undefined, it returns an empty array.
 * @param itemIdKey - The key in each item that uniquely identifies it (e.g., 'id').
 * @param nestedItemsKey - The key in each item that contains the nested items or list (e.g., 'children').
 * @param flattenedItemsResult - An array that accumulates the flattened items. Defaults to an empty array.
 * @param parentId - Optional. The ID of the parent item in the flattened structure. Defaults to undefined for top-level items.
 * @param depthLevel - Optional. The current depth level of the item in the nested structure. Defaults to 0 for top-level items.
 *
 * @returns A flat array of items, where the nested list key is removed, and each item includes:
 * - `parentId`: ID of its parent item in the flattened structure (undefined for top-level items).
 * - `depthLevel`: The depth level of the item in the hierarchy, with 0 being the top-level.
 * - `totalNestedItems`: The total number of direct child items within the current item (defaults to 0 for leaf nodes).
 *
 * @example
 * ```ts
 * const nestedData = [
 *   { id: 1, name: 'Item 1', children: [{ id: 2, name: 'Item 1.1' }] },
 *   { id: 3, name: 'Item 2', children: [] },
 * ];
 *
 * const flatList = flattenNestedList(nestedData, 'id', 'children');
 *
 * // Output:
 * // [
 * //   { id: 1, name: 'Item 1', parentId: undefined, depthLevel: 0, totalNestedItems: 1 },
 * //   { id: 2, name: 'Item 1.1', parentId: 1, depthLevel: 1, totalNestedItems: 0 },
 * //   { id: 3, name: 'Item 2', parentId: undefined, depthLevel: 0, totalNestedItems: 0 }
 * // ]
 * ```
 */
export const flattenNestedList = <OriginItem extends object>(
  items: OriginItem[] | undefined,
  itemIdKey: KeysWithNonArrayValues<OriginItem>,
  nestedItemsKey: KeysWithArrayValues<OriginItem>,
  ///
  flattenedItemsResult: HoneyFlattenedItem<OriginItem, typeof nestedItemsKey>[] = [],
  parentId: OriginItem[KeysWithNonArrayValues<OriginItem>] | undefined = undefined,
  depthLevel = 0,
): HoneyFlattenedItem<OriginItem, typeof nestedItemsKey>[] => {
  items?.forEach(item => {
    const { [nestedItemsKey]: _, ...itemWithoutNestedListKey } = item;

    const nestedItems = item[nestedItemsKey];
    const isNestedItemArray = Array.isArray(nestedItems);

    flattenedItemsResult.push({
      ...itemWithoutNestedListKey,
      parentId,
      depthLevel,
      totalNestedItems: isNestedItemArray ? nestedItems.length : 0,
    });

    if (isNestedItemArray) {
      const parentId = item[itemIdKey];

      flattenNestedList(
        nestedItems,
        itemIdKey,
        nestedItemsKey,
        flattenedItemsResult,
        parentId,
        depthLevel + 1,
      );
    }
  });

  return flattenedItemsResult;
};

/**
 * Filters a list of flattened items based on a specified parent ID and an optional predicate function.
 *
 * This utility is useful for extracting items that share the same parent in a flattened hierarchical
 * structure, such as categories or tree-like data. Optionally, it allows further filtering through a
 * custom predicate function.
 *
 * @template OriginItem - The type of the items in the flattened list.
 * @template NestedListKey - The key within `OriginItem` that contains nested items or lists.
 *
 * @param flattenedItems - The array of flattened items to filter, which contains items with hierarchical metadata.
 * @param parentId - The parent ID to filter the items by. Only items with this parent ID will be included in the result.
 * @param predicate - Optional. A custom function to apply additional filtering logic on items that match the parent ID.
 *
 * @returns An array of flattened items that match the specified `parentId`, and if provided, the `predicate` function.
 *
 * @example
 * ```ts
 * const filteredItems = filterFlattenedItems(flatList, 1, item => item.depthLevel > 1);
 *
 * // This would return items with `parentId` equal to 1, and where `depthLevel` is greater than 1.
 * ```
 */
export const filterFlattenedItems = <OriginItem extends object, NestedListKey extends string>(
  flattenedItems: HoneyFlattenedItem<OriginItem, NestedListKey>[],
  parentId: OriginItem[KeysWithNonArrayValues<OriginItem>],
  predicate?: (flattenedItem: HoneyFlattenedItem<OriginItem, NestedListKey>) => boolean,
) =>
  flattenedItems.filter(
    flattenedItem =>
      flattenedItem.parentId === parentId && (!predicate || predicate(flattenedItem)),
  );

/**
 * Searches through a list of flattened items to find matches based on a search query.
 * This function considers both the items themselves and their parents in the hierarchy, ensuring that
 * any matching items and their respective parents are included in the result.
 *
 * The search is case-insensitive and can handle partial matches, making it useful for dynamic filtering
 * of hierarchical data such as categories or trees.
 *
 * @template OriginItem - The type of the original item.
 * @template NestedListKey - The key within `OriginItem` that contains nested items or lists.
 *
 * @param flattenedItems - The array of flattened items to search through, which may include hierarchical metadata.
 * @param itemIdKey - The key used to uniquely identify each item (e.g., 'id').
 * @param valueKey - The key in each item that contains the value to be searched (e.g., 'name').
 * @param searchQuery - The query string used to filter items. Supports partial matches.
 *
 * @returns An array of matched flattened items, including their parent items if applicable.
 *
 * @example
 * ```ts
 * const searchResults = searchFlattenedItems(flatList, 'id', 'name', 'search term');
 *
 * // This will return items where the 'name' field matches the search term,
 * // including any relevant parent items in the hierarchy.
 * ```
 */
export const searchFlattenedItems = <OriginItem extends object, NestedListKey extends string>(
  flattenedItems: HoneyFlattenedItem<OriginItem, NestedListKey>[],
  itemIdKey: KeysWithNonArrayValues<OriginItem>,
  valueKey: KeysWithStringValues<OriginItem>,
  searchQuery: string,
) => {
  const searchWords = splitStringIntoWords(searchQuery.toLowerCase());
  if (!searchWords.length) {
    return flattenedItems;
  }

  const itemIdToIndexMap = flattenedItems.reduce<Record<string, number>>(
    (result, flattenedItem, flattenedItemIndex) => {
      // Item ID -> Item index
      result[flattenedItem[itemIdKey as never]] = flattenedItemIndex;

      return result;
    },
    {},
  );

  return flattenedItems.reduce<HoneyFlattenedItem<OriginItem, NestedListKey>[]>(
    (matchedFlattenedItems, flattenedItem) => {
      const flattenedItemValue = flattenedItem[valueKey as never];
      // If item value is null, undefined or empty string
      if (!flattenedItemValue) {
        return matchedFlattenedItems;
      }

      if (
        matchedFlattenedItems.some(
          matchedItem => matchedItem[itemIdKey as never] === flattenedItem[itemIdKey as never],
        )
      ) {
        return matchedFlattenedItems;
      }

      const itemWords = splitStringIntoWords((flattenedItemValue as string).toLowerCase());

      const isItemMatched = searchWords.every(searchWord =>
        itemWords.some(word => word.startsWith(searchWord)),
      );

      if (isItemMatched) {
        if (flattenedItem.parentId === undefined) {
          matchedFlattenedItems.push(flattenedItem);

          const insertNestedItems = (
            targetFlattenedItem: HoneyFlattenedItem<OriginItem, NestedListKey>,
          ) => {
            // If parent item does not have nested items, so do not iterate through the list
            if (!targetFlattenedItem.totalNestedItems) {
              return;
            }

            flattenedItems.forEach(flattenedItem => {
              if (flattenedItem.parentId === targetFlattenedItem[itemIdKey as never]) {
                matchedFlattenedItems.push(flattenedItem);

                insertNestedItems(flattenedItem);
              }
            });
          };

          insertNestedItems(flattenedItem);
        } else {
          const insertParentItems = (
            targetFlattenedItem: HoneyFlattenedItem<OriginItem, NestedListKey>,
          ) => {
            const parentItemIndex = itemIdToIndexMap[targetFlattenedItem.parentId as never];
            const parentItem = flattenedItems[parentItemIndex];

            if (parentItem.parentId !== undefined) {
              insertParentItems(parentItem);
            }

            const prevItemParentId = matchedFlattenedItems.length
              ? matchedFlattenedItems[matchedFlattenedItems.length - 1].parentId
              : null;

            const shouldInsertParentItem =
              prevItemParentId === null || prevItemParentId !== targetFlattenedItem.parentId;

            if (shouldInsertParentItem) {
              if (!parentItem) {
                throw new Error('[honey-layout]: Parent item was not found.');
              }

              matchedFlattenedItems.push(parentItem);
            }
          };

          insertParentItems(flattenedItem);

          matchedFlattenedItems.push(flattenedItem);
        }
      }

      return matchedFlattenedItems;
    },
    [],
  );
};
