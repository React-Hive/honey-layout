import type { ReactElement } from 'react';
import React from 'react';
import { act, render } from '@testing-library/react';

import { themeMock } from '../../__mocks__';
import { useHoneyLayout } from '../../hooks';
import { HoneyLayoutProvider } from '../../providers';
import type { HoneyScreenState } from '../../types';

const customRender = (element: ReactElement) =>
  render(<HoneyLayoutProvider theme={themeMock}>{element}</HoneyLayoutProvider>);

const resizeWindow = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });

  window.dispatchEvent(new Event('resize'));
};

const setOrientationType = (type: OrientationType) => {
  Object.defineProperty(window.screen.orientation, 'type', {
    configurable: true,
    writable: true,
    value: type,
  });
};

interface ScreenStateConsumerProps {
  onRender: (screenState: HoneyScreenState) => void;
}

const ScreenStateConsumer = ({ onRender }: ScreenStateConsumerProps) => {
  const { screenState } = useHoneyLayout();

  onRender(screenState);

  return null;
};

describe('[useHoneyMediaQuery]: screen state identity', () => {
  beforeEach(() => {
    resizeWindow(500);
  });

  afterEach(() => {
    setOrientationType('portrait-primary');
  });

  it('should keep the same screen state while the width stays within a breakpoint', () => {
    const onRender = vitest.fn();

    customRender(<ScreenStateConsumer onRender={onRender} />);

    act(() => resizeWindow(600));
    act(() => resizeWindow(700));

    expect(onRender).toHaveBeenCalledTimes(1);
    expect(onRender.mock.calls[0][0]).toMatchObject({ isSm: true });
  });

  it('should provide a new screen state when the width crosses a breakpoint', () => {
    const onRender = vitest.fn();

    customRender(<ScreenStateConsumer onRender={onRender} />);

    act(() => resizeWindow(800));

    expect(onRender).toHaveBeenCalledTimes(2);

    const [[prevScreenState], [nextScreenState]] = onRender.mock.calls;

    expect(nextScreenState).not.toBe(prevScreenState);
    expect(nextScreenState).toMatchObject({ isSm: false, isMd: true });
  });

  it('should provide a new screen state when the orientation changes', () => {
    const onRender = vitest.fn();

    customRender(<ScreenStateConsumer onRender={onRender} />);

    act(() => {
      setOrientationType('landscape-primary');

      window.screen.orientation.dispatchEvent(new Event('change'));
    });

    expect(onRender).toHaveBeenCalledTimes(2);
    expect(onRender.mock.calls[1][0]).toMatchObject({ isPortrait: false, isLandscape: true });
  });
});
