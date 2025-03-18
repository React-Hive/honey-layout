import React from 'react';
import type { ReactNode, PropsWithChildren } from 'react';

/**
 * This type is used to provide properties for handling different states of a component,
 * such as loading, error, and no content states, along with the content to display in each state.
 */
export interface HoneyStatusContentProps {
  /**
   * A flag indicating whether the component is in a loading state.
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * A flag indicating whether the loading content should appear on top of the content.
   *
   * @default false
   */
  isLoadingOverContent?: boolean;
  /**
   * A flag indicating whether the component has encountered an error.
   *
   * @default false
   */
  isError?: boolean;
  /**
   * A flag indicating whether the component has no content to display.
   *
   * @default false
   */
  isNoContent?: boolean;
  /**
   * The content to display when the component is in a loading state.
   *
   * @default null
   */
  loadingContent?: ReactNode;
  /**
   * The content to display when the component has encountered an error.
   *
   * @default null
   */
  errorContent?: ReactNode;
  /**
   * The content to display when the component has no content to display.
   *
   * @default null
   */
  noContent?: ReactNode;
}

/**
 * A component that conditionally renders blocks based on specified boolean flags.
 */
export const HoneyStatusContent = ({
  children,
  isLoading = false,
  isLoadingOverContent = false,
  isError = false,
  isNoContent = false,
  loadingContent = null,
  errorContent = null,
  noContent = null,
}: PropsWithChildren<HoneyStatusContentProps>) => {
  if (isError) {
    return errorContent;
  }

  if (!isLoadingOverContent && isLoading) {
    return loadingContent;
  }

  return (
    <>
      {isLoadingOverContent && isLoading && loadingContent}

      {isNoContent ? noContent : children}
    </>
  );
};
