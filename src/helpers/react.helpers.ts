import type { RefObject, Ref, RefCallback } from 'react';
import { isFunction, isObject } from '@react-hive/honey-utils';

import type { Nullable } from '../types';

/**
 * Merges multiple refs into a single ref callback.
 * This ensures that all provided refs receive the same reference.
 *
 * @param refs - A list of refs that need to be merged.
 *
 * @returns A single ref callback that assigns the element to all provided refs.
 */
export const mergeRefs =
  <T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> =>
  value => {
    refs.forEach(ref => {
      if (isFunction(ref)) {
        ref(value);
      } else if (isObject(ref)) {
        (ref as RefObject<Nullable<T>>).current = value;
      }
    });
  };
