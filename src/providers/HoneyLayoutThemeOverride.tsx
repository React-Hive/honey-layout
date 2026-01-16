import React, { useContext, useMemo } from 'react';
import merge from 'lodash.merge';
import { HoneyStyleProvider } from '@react-hive/honey-style';
import type { PropsWithChildren } from 'react';
import type { HoneyTheme } from '@react-hive/honey-style';

import { HoneyLayoutContext } from '~/contexts';

interface HoneyLayoutThemeOverrideProps {
  theme: HoneyTheme;
}

/**
 * Provides a theme override context to its children.
 * Merges the provided theme with the existing theme from the `ThemeContext`.
 *
 * @param props - The props for `HoneyLayoutThemeOverride`.
 *
 * @returns The ThemeProvider with the merged theme applied to its children.
 */
export const HoneyLayoutThemeOverride = ({
  theme,
  ...props
}: PropsWithChildren<HoneyLayoutThemeOverrideProps>) => {
  const honeyLayout = useContext(HoneyLayoutContext);

  const overriddenTheme = useMemo(
    () => merge(honeyLayout?.theme, theme),
    [honeyLayout?.theme, theme],
  );

  return <HoneyStyleProvider theme={overriddenTheme} {...props} />;
};
