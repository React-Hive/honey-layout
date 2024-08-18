import type { PropsWithChildren } from 'react';

import type { HoneyStatusContentOptions } from '../types';

/**
 * A component that conditionally renders blocks based on specified boolean flags.
 */
export const HoneyStatusContent = ({
  children,
  isLoading = false,
  isError = false,
  isNoContent = false,
  loadingContent = null,
  errorContent = null,
  noContent = null,
}: PropsWithChildren<HoneyStatusContentOptions>) => {
  if (isError) {
    return errorContent;
  }

  if (isNoContent) {
    return noContent;
  }

  return isLoading ? loadingContent : children;
};
