import type { PropsWithChildren } from 'react';
import type { DefaultTheme } from 'styled-components';
import React, { useContext, useMemo } from 'react';
import { ThemeContext, ThemeProvider } from 'styled-components';
import merge from 'lodash.merge';

type HoneyLayoutThemeOverrideProps = {
  theme: DefaultTheme;
};

/**
 * Provides a theme override context to its children.
 * Merges the provided theme with the existing theme from the `ThemeContext`.
 *
 * @param {PropsWithChildren<HoneyLayoutThemeOverrideProps>} props - The props for `HoneyLayoutThemeOverride`.
 *
 * @returns The ThemeProvider with the merged theme applied to its children.
 */
export const HoneyLayoutThemeOverride = ({
  theme,
  ...props
}: PropsWithChildren<HoneyLayoutThemeOverrideProps>) => {
  const currentTheme = useContext(ThemeContext);

  const overriddenTheme = useMemo(() => merge(currentTheme, theme), [currentTheme, theme]);

  return <ThemeProvider theme={overriddenTheme} {...props} />;
};
