/**
 * Types related to managing application state, React context, or any other state management tools.
 */

/**
 * Represents the state of the screen layout.
 */
export type HoneyScreenState = {
  /** Indicates if the screen size is extra-small (xs). */
  isXs: boolean;
  /** Indicates if the screen size is small (sm). */
  isSm: boolean;
  /** Indicates if the screen size is medium (md). */
  isMd: boolean;
  /** Indicates if the screen size is large (lg). */
  isLg: boolean;
  /** Indicates if the screen size is extra-large (xl). */
  isXl: boolean;
  /** Indicates if the screen orientation is portrait. */
  isPortrait: boolean;
  /** Indicates if the screen orientation is landscape. */
  isLandscape: boolean;
};
