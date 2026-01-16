import { createContext } from 'react';

import type { HoneyLayerId, HoneyLayerEntry } from '~/components';

/**
 * Context value exposed by {@link HoneyLayerRegistry}.
 *
 * @template TPayload - Payload type associated with registered layers.
 */
export interface HoneyLayerRegistryContextValue<TPayload = undefined> {
  /**
   * Ordered list of currently registered layers.
   *
   * The order reflects the registration sequence:
   * - earlier items are "below"
   * - later items are "above"
   */
  layers: HoneyLayerEntry<TPayload>[];
  /**
   * Registers a new layer in the registry.
   *
   * @param payload - Optional payload associated with the layer.
   *
   * @returns The generated {@link HoneyLayerId}.
   */
  registerLayer: (payload?: TPayload) => HoneyLayerId;
  /**
   * Unregisters an existing layer.
   *
   * If the layer ID does not exist, this operation is a no-op.
   *
   * @param layerId - ID of the layer to remove.
   */
  unregisterLayer: (layerId: HoneyLayerId) => void;
  /**
   * Returns the zero-based index of a layer in the stack.
   *
   * @param layerId - ID of the layer.
   *
   * @returns
   * - `0` or greater if the layer is registered
   * - `-1` if the layer is not found
   */
  getLayerIndex: (layerId: HoneyLayerId) => number;
}

export const HoneyLayerRegistryContext = createContext<HoneyLayerRegistryContextValue | undefined>(
  undefined,
);
