/**
 * Types that are tightly coupled with specific components, such as component props, event handlers, or states.
 */
import type { ReactNode } from 'react';

/**
 * Type definition for status content options in a component.
 *
 * This type is used to provide properties for handling different states of a component,
 * such as loading, error, and no content states, along with the content to display in each state.
 *
 * @template T - An optional generic type parameter to extend the type with additional properties.
 */
export type HoneyStatusContentOptions<T = unknown> = {
  /**
   * A flag indicating whether the component is in a loading state.
   *
   * @default false
   */
  isLoading?: boolean;
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
} & T;
