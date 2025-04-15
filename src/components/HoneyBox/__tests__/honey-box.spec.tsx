import React from 'react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

import { themeMock } from '../../../__mocks__';
import { HoneyLayoutProvider } from '../../../providers';
import { HoneyBox } from '../HoneyBox';

const customRender = (element: ReactElement) =>
  render(<HoneyLayoutProvider theme={themeMock}>{element}</HoneyLayoutProvider>);

describe('[HoneyBox]: basic behavior', () => {
  it('should apply `width` and `height` styles', () => {
    const { getByTestId } = customRender(<HoneyBox $width="100%" $height="50px" />);

    expect(getByTestId('honey-box')).toHaveStyle({
      width: '100%',
      height: '50px',
    });
  });

  it('should apply `padding` and `margin` styles', () => {
    const { getByTestId } = customRender(<HoneyBox $padding="8px" $margin="4px" />);

    expect(getByTestId('honey-box')).toHaveStyle({
      padding: '8px',
      margin: '4px',
    });
  });

  it('should apply shorthand `padding` and `margin` with 2 values', () => {
    const { getByTestId } = customRender(
      <HoneyBox $padding={['8px', '4px']} $margin={['0', 'auto']} />,
    );

    expect(getByTestId('honey-box')).toHaveStyle({
      padding: '8px 4px',
      margin: '0 auto',
    });
  });

  it('should apply shorthand `padding` and `margin` with 3 values', () => {
    const { getByTestId } = customRender(
      <HoneyBox $padding={['8px', '4px', '12px']} $margin={['0', 'auto', '8px']} />,
    );

    expect(getByTestId('honey-box')).toHaveStyle({
      padding: '8px 4px 12px',
      margin: '0 auto 8px',
    });
  });

  it('should apply shorthand `padding` and `margin` with 4 values', () => {
    const { getByTestId } = customRender(
      <HoneyBox $padding={['8px', '4px', '12px', '4px']} $margin={['0', 'auto', '8px', 'auto']} />,
    );

    expect(getByTestId('honey-box')).toHaveStyle({
      padding: '8px 4px 12px 4px',
      margin: '0 auto 8px auto',
    });
  });

  it('should convert numeric `padding` and `margin` values as px', () => {
    const { getByTestId } = customRender(<HoneyBox $padding={[1, 0.5]} $margin={[1, 0.5, 3]} />);

    expect(getByTestId('honey-box')).toHaveStyle({
      padding: '8px 4px',
      margin: '8px 4px 24px',
    });
  });

  it('should apply mixed `padding` with string and numeric values', () => {
    const { getByTestId } = customRender(
      <HoneyBox $padding={['8px', 0.5]} $margin={[1, 'auto', '12px']} />,
    );

    expect(getByTestId('honey-box')).toHaveStyle({
      padding: '8px 4px',
      margin: '8px auto 12px',
    });
  });

  it('should apply `backgroundColor` when provided as HEX value', () => {
    const { getByTestId } = customRender(<HoneyBox $backgroundColor="#FFF" />);

    expect(getByTestId('honey-box')).toHaveStyle({
      backgroundColor: '#FFF',
    });
  });

  it('should apply `backgroundColor` when provided as a named color', () => {
    const { getByTestId } = customRender(<HoneyBox $backgroundColor="white" />);

    expect(getByTestId('honey-box')).toHaveStyle({
      backgroundColor: 'white',
    });
  });

  it('should apply `backgroundColor` from the theme', () => {
    const { getByTestId } = customRender(<HoneyBox $backgroundColor="primary.royalBlue" />);

    expect(getByTestId('honey-box')).toHaveStyle({
      backgroundColor: '#4169E1',
    });
  });
});
