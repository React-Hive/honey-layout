import { flattenNestedList, searchFlattenedItems } from '../data-utils';
import type { HoneyFlattenedItem } from '../../types';

describe('[flattenNestedList]: convert nested list to flat list', () => {
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

describe('[searchFlattenedItems]: search flattened items', () => {
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
