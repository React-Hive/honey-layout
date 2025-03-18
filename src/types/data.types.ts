/**
 * Store types that represent data structures, transformations, and models used across different components and modules.
 */
import type { MutableRefObject } from 'react';
import type { StyleFunction } from 'styled-components';

import type { KeysWithNonArrayValues, Nullable } from './utility.types';
import type { HoneyKeyboardEventCode } from './dom.types';

export type HoneyEffectResultFn<Props extends object> = StyleFunction<Props>;

export type HoneyEffect<Config = unknown, Props extends object = object> = (
  config: Config,
) => HoneyEffectResultFn<Props>;

export type HoneyOverlayId = string;

export type HoneyOverlayEventListenerType = 'keyup';

/**
 * Handler function for an overlay event listener.
 *
 * @param keyCode - The code of the key that triggered the event.
 * @param overlay - The overlay.
 * @param e - The original keyboard event.
 */
export type HoneyOverlayEventListenerHandler = (
  keyCode: HoneyKeyboardEventCode,
  overlay: HoneyActiveOverlay,
  e: KeyboardEvent,
) => void;

/**
 * A tuple representing an event listener, including the event type and the handler function.
 */
export type HoneyOverlayEventListener = [
  HoneyOverlayEventListenerType,
  HoneyOverlayEventListenerHandler,
];

/**
 * Configuration object for an overlay, used to specify the overlay's behavior and event handling.
 */
export interface HoneyOverlayConfig {
  /**
   * Custom overlay ID.
   * Automatically generated if not passed.
   *
   * @default It generates automatically
   */
  id?: HoneyOverlayId;
  /**
   * List of keyboard event codes to listen for (e.g., "Escape", "Enter").
   * If undefined or empty, all key codes will be listened to.
   *
   * @default undefined
   */
  listenKeys?: HoneyKeyboardEventCode[];
  /**
   * Callback function to be invoked when a key event occurs for the specified key(s).
   * If `listenKeys` is provided, this will only be triggered for those keys.
   */
  onKeyUp: HoneyOverlayEventListenerHandler;
}

/**
 * Represents an overlay in the layout, allowing the registration of event listeners and notifying them when events occur.
 */
export interface HoneyActiveOverlay {
  /**
   * Unique identifier for the overlay.
   */
  id: HoneyOverlayId;
  /**
   * Reference to the container element of the overlay.
   */
  containerRef: MutableRefObject<Nullable<HTMLDivElement>>;
  /**
   * Sets the container reference for the overlay.
   *
   * @param element - The HTMLDivElement to set as the container.
   */
  setContainerRef: (element: HTMLDivElement) => void;
  /**
   * Adds an event listener to the overlay.
   *
   * @param type - The type of event to listen for.
   * @param handler - The handler function to execute when the event is triggered.
   */
  addListener: (
    type: HoneyOverlayEventListenerType,
    handler: HoneyOverlayEventListenerHandler,
  ) => void;
  /**
   * Removes a specific event listener from the overlay.
   *
   * @param type - The type of event for the listener.
   * @param handler - The handler function to remove.
   */
  removeListener: (
    type: HoneyOverlayEventListenerType,
    handler: HoneyOverlayEventListenerHandler,
  ) => void;
  /**
   * Notifies all listeners of a specific event type.
   *
   * @param type - The type of event that occurred.
   * @param keyCode - The code of the key that triggered the event.
   * @param e - The original keyboard event.
   */
  notifyListeners: (
    type: HoneyOverlayEventListenerType,
    keyCode: HoneyKeyboardEventCode,
    e: KeyboardEvent,
  ) => void;
}

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
