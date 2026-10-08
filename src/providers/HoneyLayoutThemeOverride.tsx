import type { PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import merge from 'lodash.merge';
import { HoneyStyleProvider, useHoneyStyle } from '@react-hive/honey-style';
import type { HoneyTheme } from '@react-hive/honey-style';

import type { DeepPartial } from '../types';

interface HoneyLayoutThemeOverrideProps {
  /**
   * The theme values to override. Only the keys that change are needed: they are deep-merged
   * into a copy of the parent theme.
   *
   * Pass a stable object (a module-level constant or a memoized value), since a new object
   * re-creates the merged theme and restyles the whole subtree.
   */
  theme: DeepPartial<HoneyTheme>;
}

/**
 * Overrides parts of the theme for its children.
 *
 * Deep-merges `theme` into a copy of the nearest Honey style theme (from `HoneyLayoutProvider` or a
 * parent `HoneyLayoutThemeOverride`), so the parent theme is never mutated and overrides can be
 * nested. Styled components and `useHoneyStyle().theme` receive the merged theme, while
 * `useHoneyLayout()` keeps the provider's theme and screen state.
 *
 * @param props - The props for `HoneyLayoutThemeOverride`.
 *
 * @returns The Honey style provider with the merged theme applied to its children.
 *
 * @example
 * ```tsx
 * const brandTheme = {
 *   colors: {
 *     primary: {
 *       royalBlue: '#1E40AF',
 *     },
 *   },
 * };
 *
 * <HoneyLayoutThemeOverride theme={brandTheme}>
 *   <App />
 * </HoneyLayoutThemeOverride>
 * ```
 */
export const HoneyLayoutThemeOverride = ({
  theme,
  children,
}: PropsWithChildren<HoneyLayoutThemeOverrideProps>) => {
  const { theme: parentTheme } = useHoneyStyle();

  const overriddenTheme = useMemo<HoneyTheme>(
    () => merge({}, parentTheme, theme),
    [parentTheme, theme],
  );

  return <HoneyStyleProvider theme={overriddenTheme}>{children}</HoneyStyleProvider>;
};
