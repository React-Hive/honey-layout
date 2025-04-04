import type { RefObject, Ref, RefCallback } from 'react';
import type { IStyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

import type { Nullable } from '../types';

// https://styled-components.com/docs/faqs#shouldforwardprop-is-no-longer-provided-by-default
export const shouldForwardProp: IStyleSheetManager['shouldForwardProp'] = (propName, target) => {
  if (typeof target === 'string') {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
};

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
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && typeof ref === 'object') {
        (ref as RefObject<Nullable<T>>).current = value;
      }
    });
  };
