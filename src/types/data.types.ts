/**
 * Store types that represent data structures, transformations, and models used across different components and modules.
 */
import type { KeysWithNonArrayValues } from './utility.types';

/**
 * Represents an item that has been flattened from a hierarchical data structure, with additional
 * properties to support tracking its position and relationships within the hierarchy.
 *
 * This type is particularly useful for scenarios where nested data structures, such as trees or
 * lists with sub-items, need to be transformed into a flat structure while preserving the depth
 * and parent-child relationships.
 *
 * @template OriginItem - The type of the original item from the hierarchical structure.
 * @template NestedListKey - The key within `OriginItem` that contains nested items or lists.
 */
export type HoneyFlattenedItem<OriginItem extends object, NestedListKey extends string> = Omit<
  OriginItem,
  // Remove `NestedListKey` from the keys of `Item`
  NestedListKey
> & {
  /**
   * The optional id of the parent item in the flattened structure. This establishes the parent-child
   * relationship and allows the reconstruction of the original hierarchy if needed.
   */
  parentId: OriginItem[KeysWithNonArrayValues<OriginItem>] | undefined;
  /**
   * The depth level of the item in the flattened structure. This indicates how deep the item is nested
   * within the hierarchy, starting from 0 for top-level items.
   *
   * @default 0
   */
  depthLevel: number;
  /**
   * The total number of nested items that are contained within the current item. This helps to keep
   * track of the overall size of the nested structure for each item.
   *
   * @default 0
   */
  totalNestedItems: number;
};
