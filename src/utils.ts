import type {
  HoneyCSSMediaRule,
  HoneyFlattenedItem,
  HoneyHEXColor,
  KeysWithArrayValues,
  KeysWithNonArrayValues,
  KeysWithStringValues,
} from './types';

export const camelToDashCase = (inputString: string): string =>
  inputString.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

/**
 * Splits a string into an array of filtered from redundant spaces words.
 *
 * @param {string} inputString - The input string to be split.
 *
 * @returns {string[]} An array of words from the input string.
 */
export const splitStringIntoWords = (inputString: string): string[] =>
  inputString.split(' ').filter(v => v);

/**
 * Converts a pixel value to rem.
 *
 * @param px - The pixel value to be converted to rem.
 * @param base - The base value for conversion. Default is 16, which is the typical root font size.
 *
 * @returns The value in rem as a string.
 */
export const pxToRem = (px: number, base: number = 16): string => `${px / base}rem`;

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param {number} startX - The X coordinate of the starting point.
 * @param {number} startY - The Y coordinate of the starting point.
 * @param {number} endX - The X coordinate of the ending point.
 * @param {number} endY - The Y coordinate of the ending point.
 *
 * @returns {number} - The Euclidean distance between the two points.
 */
export const calculateEuclideanDistance = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): number => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
};

/**
 * Calculates the moving speed.
 *
 * @param {number} delta - The change in position (distance).
 * @param {number} elapsedTime - The time taken to move the distance.
 *
 * @returns {number} - The calculated speed, which is the absolute value of delta divided by elapsed time.
 */
export const calculateMovingSpeed = (delta: number, elapsedTime: number): number =>
  Math.abs(delta / elapsedTime);

/**
 * Calculates the specified percentage of a given value.
 *
 * @param {number} value - The value to calculate the percentage of.
 * @param {number} percentage - The percentage to calculate.
 *
 * @returns {number} - The calculated percentage of the value.
 */
export const calculatePercentage = (value: number, percentage: number): number => {
  return (value * percentage) / 100;
};

/**
 * Converts a 3-character or 6-character HEX color code to an 8-character HEX with alpha (RRGGBBAA) format.
 *
 * @param hex - The 3-character or 6-character HEX color code (e.g., "#RGB" or "#RRGGBB" or "RGB" or "RRGGBB").
 * @param alpha - The alpha transparency value between 0 (fully transparent) and 1 (fully opaque).
 *
 * @throws {Error} If alpha value is not between 0 and 1, or if the hex code is invalid.
 *
 * @returns {HoneyHEXColor} - The 8-character HEX with alpha (RRGGBBAA) format color code, or null if input is invalid.
 */
export const convertHexToHexWithAlpha = (hex: string, alpha: number): HoneyHEXColor => {
  if (alpha < 0 || alpha > 1) {
    throw new Error(`[honey-layout]: Alpha "${alpha}" is not a valid hex format.`);
  }

  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

  const match = hex.match(hexRegex);
  if (!match) {
    throw new Error(`[honey-layout]: Invalid hex format.`);
  }

  const cleanHex = match[1];

  // Expand 3-character hex to 6-character hex if necessary
  const fullHex =
    cleanHex.length === 3
      ? cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2]
      : cleanHex;

  // Convert to 8-character hex with alpha
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');

  return `#${fullHex + alphaHex}`;
};

/**
 * Builds a media query string based on the provided options.
 *
 * @param {HoneyCSSMediaRule[]} rules - Conditions for the media query.
 *
 * @returns {string} The generated media query string.
 */
export const media = (rules: HoneyCSSMediaRule[]): string => {
  const mediaRules = rules.map(rule => {
    const conditions = [
      rule.width && ['width', rule.width],
      rule.minWidth && ['min-width', rule.minWidth],
      rule.maxWidth && ['max-width', rule.maxWidth],
      rule.height && ['height', rule.height],
      rule.minHeight && ['min-height', rule.minHeight],
      rule.maxHeight && ['max-height', rule.maxHeight],
      rule.orientation && ['orientation', rule.orientation],
      rule.minResolution && ['min-resolution', rule.minResolution],
      rule.maxResolution && ['max-resolution', rule.maxResolution],
      rule.resolution && ['resolution', rule.resolution],
      rule.update && ['update', rule.update],
    ]
      .filter(Boolean)
      .map(r => r && `(${r[0]}: ${r[1]})`)
      .join(' and ');

    const operatorPart = rule.operator ? `${rule.operator} ` : '';
    const conditionsPart = conditions ? ` and ${conditions}` : '';

    return `${operatorPart}${rule.mediaType ?? 'screen'}${conditionsPart}`;
  });

  return `@media ${mediaRules.join(', ')}`;
};

type HTMLElementTransformationValues = {
  translateX: number;
  translateY: number;
};

/**
 * Get various transformation values from the transformation matrix of an element.
 *
 * @param {HTMLElement} element - The element with a transformation applied.
 *
 * @returns {HTMLElementTransformationValues} An object containing transformation values.
 */
export const getTransformationValues = (element: HTMLElement): HTMLElementTransformationValues => {
  const computedStyles = window.getComputedStyle(element);
  const transformValue = computedStyles.getPropertyValue('transform');

  const matrix = transformValue.match(/^matrix\((.+)\)$/);
  if (!matrix) {
    return {
      translateX: 0,
      translateY: 0,
    };
  }

  const transformMatrix = matrix[1].split(', ');

  const translateX = parseFloat(transformMatrix[4]);
  const translateY = parseFloat(transformMatrix[5]);

  return {
    translateX,
    translateY,
  };
};

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
