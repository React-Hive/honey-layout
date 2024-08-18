import React, { useContext, useMemo } from 'react';
import { ThemeContext, ThemeProvider } from 'styled-components';
import merge from 'lodash.merge';

import type { PropsWithChildren, JSX } from 'react';
import type { DefaultTheme } from 'styled-components';

type HoneyThemeProviderProps = {
  theme: DefaultTheme;
};

/**
 * Component for providing a merged theme to its children.
 * Merges the provided theme with the current theme from the context.
 *
 * @param {PropsWithChildren<HoneyThemeProviderProps>} props - Props containing the theme object.
 * @returns {JSX.Element} - The wrapped children with the merged theme.
 */
export const HoneyThemeProvider = ({
  children,
  theme,
}: PropsWithChildren<HoneyThemeProviderProps>): JSX.Element => {
  const currentTheme = useContext(ThemeContext);

  const overriddenTheme = useMemo(() => merge(currentTheme, theme), [currentTheme, theme]);

  return <ThemeProvider theme={overriddenTheme}>{children}</ThemeProvider>;
};
