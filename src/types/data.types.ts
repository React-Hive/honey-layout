/**
 * Store types that represent data structures, transformations, and models used across different components and modules.
 */
import type { RefObject } from 'react';
import type { HoneyStyledFunction } from '@react-hive/honey-style';

import type { Nullable } from './utility.types';
import type { HoneyKeyboardEventCode } from './dom.types';

export type HoneyEffectResultFn<Props extends object> = HoneyStyledFunction<Props>;

export type HoneyEffect<Config = unknown, Props extends object = object> = (
  config: Config,
) => HoneyEffectResultFn<Props>;

export type HoneyOverlayId = string;

export type HoneyOverlayEventType = 'keyup';

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
export type HoneyOverlayEventListener = [HoneyOverlayEventType, HoneyOverlayEventListenerHandler];

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
  containerRef: RefObject<Nullable<HTMLDivElement>>;
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
  addListener: (type: HoneyOverlayEventType, handler: HoneyOverlayEventListenerHandler) => void;
  /**
   * Removes a specific event listener from the overlay.
   *
   * @param type - The type of event for the listener.
   * @param handler - The handler function to remove.
   */
  removeListener: (type: HoneyOverlayEventType, handler: HoneyOverlayEventListenerHandler) => void;
  /**
   * Notifies all listeners of a specific event type.
   *
   * @param targetEventType - The type of event that occurred.
   * @param keyCode - The code of the key that triggered the event.
   * @param e - The original keyboard event.
   */
  notifyListeners: (
    targetEventType: HoneyOverlayEventType,
    keyCode: HoneyKeyboardEventCode,
    e: KeyboardEvent,
  ) => void;
}
