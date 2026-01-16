import { useContext } from 'react';
import { assert } from '@react-hive/honey-utils';

import type { HoneyLayerRegistryContextValue } from '../HoneyLayerRegistryContext';
import { HoneyLayerRegistryContext } from '../HoneyLayerRegistryContext';

/**
 * Hook for accessing the nearest {@link HoneyLayerRegistry}.
 *
 * @template TPayload - Expected payload type of the registry.
 *
 * @throws If used outside of a {@link HoneyLayerRegistry} provider.
 */
export const useHoneyLayerRegistryContext = <TPayload>() => {
  const context = useContext(HoneyLayerRegistryContext) as
    | HoneyLayerRegistryContextValue<TPayload>
    | undefined;

  assert(
    context,
    'The `useHoneyLayerRegistryContext()` hook can only be used inside <HoneyLayerRegistry/> component!',
  );

  return context;
};
