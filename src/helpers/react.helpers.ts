import type { IStyleSheetManager } from 'styled-components';

import isPropValid from '@emotion/is-prop-valid';

// https://styled-components.com/docs/faqs#shouldforwardprop-is-no-longer-provided-by-default
export const shouldForwardProp: IStyleSheetManager['shouldForwardProp'] = (propName, target) => {
  if (typeof target === 'string') {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
};
