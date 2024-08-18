import type { HoneyFlattenedItem } from '../types';
import { convertHexToHexWithAlpha, flattenNestedList, searchFlattenedItems } from '../utils';

describe('[utils]: converting hex to hex with alpha', () => {
  it('should convert short hex without hash and alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('FFF', 0)).toBe('#FFFFFF00');
  });

  it('should convert short hex with hash and alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFF', 0)).toBe('#FFFFFF00');
  });

  it('should convert short hex with hash and alpha 1 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFF', 1)).toBe('#FFFFFFFF');
  });

  it('should convert full hex with alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFFFFF', 0)).toBe('#FFFFFF00');
  });

  it('should convert full hex with alpha 0.7 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFFFFF', 0.7)).toBe('#FFFFFFB3');
  });

  it('should convert full hex with alpha 1 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFFFFF', 1)).toBe('#FFFFFFFF');
  });

  it('should convert minimum 3-char hex with alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#000', 0)).toBe('#00000000');
  });

  it('should convert maximum 3-char hex with alpha 1 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFF', 1)).toBe('#FFFFFFFF');
  });

  it('should convert minimum 6-char hex with alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#000000', 0)).toBe('#00000000');
  });

  it('should convert maximum 6-char hex with alpha 1 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFFFFF', 1)).toBe('#FFFFFFFF');
  });

  it('should throw error for invalid hex code', () => {
    expect(() => convertHexToHexWithAlpha('#ZZZ', 0)).toThrow();
  });

  it('should throw error for alpha value less than 0', () => {
    expect(() => convertHexToHexWithAlpha('#FFF', -0.1)).toThrow();
  });

  it('should throw error for alpha value greater than 1', () => {
    expect(() => convertHexToHexWithAlpha('#FFF', 1.1)).toThrow();
  });
});

describe('[utils]: convert nested list to flat list', () => {
  type Item = {
    id: number;
    name: string;
    children?: Item[] | null;
  };

  it('should handle undefined input list', () => {
    const items: Item[] | undefined = undefined;

    const flatList = flattenNestedList(items, 'id', 'children');

    expect(flatList).toStrictEqual([]);
  });

  it('should handle empty input list', () => {
    const items: Item[] = [];

    const flatList = flattenNestedList(items, 'id', 'children');

    expect(flatList).toStrictEqual([]);
  });

  it('should flatten a nested list excluding the nested key', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Apple',
        children: [
          {
            id: 2,
            name: 'Pear',
            children: [],
          },
          {
            id: 3,
            name: 'Banana',
            children: [],
          },
        ],
      },
    ];

    const flatList = flattenNestedList(items, 'id', 'children');

    expect(flatList).toStrictEqual([
      {
        id: 1,
        name: 'Apple',
        parentId: undefined,
        depthLevel: 0,
        totalNestedItems: 2,
      },
      {
        id: 2,
        name: 'Pear',
        parentId: 1,
        depthLevel: 1,
        totalNestedItems: 0,
      },
      {
        id: 3,
        name: 'Banana',
        parentId: 1,
        depthLevel: 1,
        totalNestedItems: 0,
      },
    ]);
  });

  it('should handle deeply nested lists', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Apple',
        children: [
          {
            id: 2,
            name: 'Pear',
            children: [
              {
                id: 3,
                name: 'Banana',
                children: [
                  {
                    id: 4,
                    name: 'Mango',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const flatList = flattenNestedList(items, 'id', 'children');

    expect(flatList).toStrictEqual([
      {
        id: 1,
        name: 'Apple',
        parentId: undefined,
        depthLevel: 0,
        totalNestedItems: 1,
      },
      {
        id: 2,
        name: 'Pear',
        parentId: 1,
        depthLevel: 1,
        totalNestedItems: 1,
      },
      {
        id: 3,
        name: 'Banana',
        parentId: 2,
        depthLevel: 2,
        totalNestedItems: 1,
      },
      {
        id: 4,
        name: 'Mango',
        parentId: 3,
        depthLevel: 3,
        totalNestedItems: 0,
      },
    ]);
  });

  it('should handle items without children', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Apple',
      },
      {
        id: 2,
        name: 'Banana',
      },
    ];

    const flatList = flattenNestedList(items, 'id', 'children');

    expect(flatList).toStrictEqual([
      {
        id: 1,
        name: 'Apple',
        parentId: undefined,
        depthLevel: 0,
        totalNestedItems: 0,
      },
      {
        id: 2,
        name: 'Banana',
        parentId: undefined,
        depthLevel: 0,
        totalNestedItems: 0,
      },
    ]);
  });

  it('should handle items with undefined or null children', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Apple',
        children: undefined,
      },
      {
        id: 2,
        name: 'Banana',
        children: null,
      },
    ];

    const flatList = flattenNestedList(items, 'id', 'children');

    expect(flatList).toStrictEqual([
      {
        id: 1,
        name: 'Apple',
        parentId: undefined,
        depthLevel: 0,
        totalNestedItems: 0,
      },
      {
        id: 2,
        name: 'Banana',
        parentId: undefined,
        depthLevel: 0,
        totalNestedItems: 0,
      },
    ]);
  });
});

describe('[utils]: search flattened items', () => {
  type Item = {
    id: number;
    name: string;
    children?: Item[] | null;
  };

  const items1: HoneyFlattenedItem<Item, 'children'>[] = [
    {
      id: 1,
      name: 'Apple',
      parentId: undefined,
      totalNestedItems: 0,
      depthLevel: 0,
    },
    {
      id: 2,
      name: 'Pear',
      parentId: undefined,
      totalNestedItems: 0,
      depthLevel: 0,
    },
  ];

  const items2: HoneyFlattenedItem<Item, 'children'>[] = [
    {
      id: 1,
      name: 'Apple',
      parentId: undefined,
      totalNestedItems: 0,
      depthLevel: 0,
    },
    {
      id: 2,
      name: 'Pear',
      parentId: undefined,
      totalNestedItems: 1,
      depthLevel: 0,
    },
    {
      id: 3,
      name: 'Banana',
      parentId: 2,
      totalNestedItems: 1,
      depthLevel: 1,
    },
    {
      id: 4,
      name: 'Pineapple',
      parentId: 3,
      totalNestedItems: 0,
      depthLevel: 2,
    },
  ];

  it('should return an empty array when the items list is empty', () => {
    const items: HoneyFlattenedItem<Item, 'children'>[] = [];

    expect(searchFlattenedItems(items, 'id', 'name', '')).toEqual([]);
  });

  it('should return all items when the search query is empty', () => {
    expect(searchFlattenedItems(items1, 'id', 'name', '')).toEqual(items1);
  });

  it('should return matched item when the search query partially matches an item name', () => {
    expect(searchFlattenedItems(items1, 'id', 'name', 'App')).toEqual([items1[0]]);
  });

  it('should return parent and matched child items when the search query matches a child item name', () => {
    expect(searchFlattenedItems(items2, 'id', 'name', 'Banana')).toEqual([items2[1], items2[2]]);
  });

  it('should return parent, intermediate parent, and matched child items when the search query matches a deeply nested child item name', () => {
    expect(searchFlattenedItems(items2, 'id', 'name', 'Pine')).toEqual([
      items2[1],
      items2[2],
      items2[3],
    ]);
  });

  it('should return the parent and all nested items that match the search query', () => {
    expect(searchFlattenedItems(items2, 'id', 'name', 'Pear')).toEqual([
      items2[1],
      items2[2],
      items2[3],
    ]);
  });
});
