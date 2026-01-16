/**
 * Unique identifier for a registered layer.
 *
 * The ID is ephemeral and only guaranteed to be unique within the lifetime of the registry.
 */
export type HoneyLayerId = string;

/**
 * A single layer entry stored in the registry.
 *
 * @template TPayload - Optional payload associated with the layer.
 */
export interface HoneyLayerEntry<TPayload = undefined> {
  /**
   * Unique identifier of the layer.
   */
  id: HoneyLayerId;
  /**
   * Arbitrary payload associated with the layer.
   *
   * Can be used to store metadata such as:
   *  - layer type
   *  - priority
   *  - owner component
   *  - configuration data
   */
  payload: TPayload;
}
