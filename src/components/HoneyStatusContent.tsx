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
  loading?: boolean;
  /**
   * The content to display when the component is in a loading state.
   *
   * @default null
   */
  loadingContent?: ReactNode;
  /**
   * A flag indicating whether the loading content should appear on top of the content.
   *
   * @default false
   */
  loadingOverContent?: boolean;
  /**
   * A flag indicating whether the component has encountered an error.
   *
   * @default false
   */
  error?: boolean;
  /**
   * The content to display when the component has encountered an error.
   *
   * @default null
   */
  errorContent?: ReactNode;
  /**
   * A flag indicating whether the component has no content to display.
   *
   * @default false
   */
  empty?: boolean;
  /**
   * The content to display when the component has no content to display.
   *
   * @default null
   */
  emptyContent?: ReactNode;
}

/**
 * A component that conditionally renders blocks based on specified boolean flags.
 */
export const HoneyStatusContent = ({
  children,
  loading = false,
  loadingOverContent = false,
  error = false,
  empty = false,
  loadingContent = null,
  errorContent = null,
  emptyContent = null,
}: PropsWithChildren<HoneyStatusContentProps>) => {
  if (error) {
    return errorContent;
  }

  if (!loadingOverContent && loading) {
    return loadingContent;
  }

  return (
    <>
      {loadingOverContent && loading && loadingContent}

      {empty ? emptyContent : children}
    </>
  );
};
