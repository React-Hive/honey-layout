import React, { useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { generateEphemeralId } from '@react-hive/honey-utils';

import type { HoneyLayerEntry } from '~/components';
import type { HoneyLayerRegistryContextValue } from './HoneyLayerRegistryContext';
import { HoneyLayerRegistryContext } from './HoneyLayerRegistryContext';

/**
 * Provides a stack-based registry for managing layered UI elements.
 *
 * This component is intentionally generic and UI-agnostic.
 * It can be used to manage:
 *  - curtains
 *  - modals
 *  - drawers
 *  - tooltips
 *  - popovers
 *  - any ordered overlay system
 *
 * If a parent {@link HoneyLayerRegistry} already exists in the tree,
 * this component becomes a no-op and does not create a nested registry.
 */
export const HoneyLayerRegistry = ({ children }: PropsWithChildren) => {
  const parentRegistry = useContext(HoneyLayerRegistryContext);

  const [layers, setLayers] = useState<HoneyLayerEntry[]>([]);

  const contextValue = useMemo<HoneyLayerRegistryContextValue>(
    () => ({
      layers,
      registerLayer: payload => {
        const layerId = generateEphemeralId();

        setLayers(layers => [
          ...layers,
          {
            id: layerId,
            payload,
          },
        ]);

        return layerId;
      },
      unregisterLayer: layerId => {
        setLayers(layers => layers.filter(layer => layer.id !== layerId));
      },
      getLayerIndex: layerId => layers.findIndex(layer => layer.id === layerId),
    }),
    [layers],
  );

  if (parentRegistry) {
    // Prevent multiple registries in the same subtree
    return children;
  }

  return <HoneyLayerRegistryContext value={contextValue}>{children}</HoneyLayerRegistryContext>;
};
