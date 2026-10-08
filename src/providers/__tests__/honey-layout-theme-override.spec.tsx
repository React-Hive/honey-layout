import type { ReactElement } from 'react';
import React from 'react';
import { render } from '@testing-library/react';
import { useHoneyStyle } from '@react-hive/honey-style';

import { themeMock } from '../../__mocks__';
import { HoneyBox } from '../../components';
import { HoneyLayoutProvider } from '../HoneyLayoutProvider';
import { HoneyLayoutThemeOverride } from '../HoneyLayoutThemeOverride';

const customRender = (element: ReactElement) =>
  render(<HoneyLayoutProvider theme={themeMock}>{element}</HoneyLayoutProvider>);

const primaryOverride = {
  colors: {
    primary: {
      royalBlue: '#123456',
    },
  },
};

const ThemePrimaryColor = () => {
  const { theme } = useHoneyStyle();

  return <div data-testid="theme-primary-color">{theme.colors.primary.royalBlue}</div>;
};

describe('[HoneyLayoutThemeOverride]: basic behavior', () => {
  it('should apply a partial theme to styled descendants', () => {
    const { getByTestId } = customRender(
      <HoneyLayoutThemeOverride theme={primaryOverride}>
        <HoneyBox $color="primary.royalBlue" />
      </HoneyLayoutThemeOverride>,
    );

    expect(getByTestId('honey-box')).toHaveStyle({
      color: '#123456',
    });
  });

  it('should keep the parent values that are not overridden', () => {
    const { getByTestId } = customRender(
      <HoneyLayoutThemeOverride theme={primaryOverride}>
        <HoneyBox $color="neutral.charcoalDark" />
      </HoneyLayoutThemeOverride>,
    );

    expect(getByTestId('honey-box')).toHaveStyle({
      color: '#222222',
    });
  });

  it('should not mutate the parent theme', () => {
    customRender(
      <HoneyLayoutThemeOverride theme={primaryOverride}>
        <HoneyBox $color="primary.royalBlue" />
      </HoneyLayoutThemeOverride>,
    );

    expect(themeMock.colors.primary.royalBlue).toBe('#4169E1');
  });

  it('should not affect siblings rendered outside the override', () => {
    const { getByTestId } = customRender(
      <>
        <HoneyLayoutThemeOverride theme={primaryOverride}>
          <HoneyBox $color="primary.royalBlue" data-testid="inside" />
        </HoneyLayoutThemeOverride>

        <HoneyBox $color="primary.royalBlue" data-testid="outside" />
      </>,
    );

    expect(getByTestId('inside')).toHaveStyle({
      color: '#123456',
    });
    expect(getByTestId('outside')).toHaveStyle({
      color: '#4169E1',
    });
  });

  it('should expose the merged theme through `useHoneyStyle()`', () => {
    const { getByTestId } = customRender(
      <HoneyLayoutThemeOverride theme={primaryOverride}>
        <ThemePrimaryColor />
      </HoneyLayoutThemeOverride>,
    );

    expect(getByTestId('theme-primary-color')).toHaveTextContent('#123456');
  });

  it('should merge nested overrides on top of each other', () => {
    const { getByTestId } = customRender(
      <HoneyLayoutThemeOverride theme={primaryOverride}>
        <HoneyLayoutThemeOverride theme={{ colors: { neutral: { charcoalDark: '#654321' } } }}>
          <HoneyBox $color="primary.royalBlue" data-testid="primary" />
          <HoneyBox $color="neutral.charcoalDark" data-testid="neutral" />
        </HoneyLayoutThemeOverride>
      </HoneyLayoutThemeOverride>,
    );

    expect(getByTestId('primary')).toHaveStyle({
      color: '#123456',
    });
    expect(getByTestId('neutral')).toHaveStyle({
      color: '#654321',
    });
  });
});
