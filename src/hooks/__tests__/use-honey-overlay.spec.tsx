import React from 'react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

import { themeMock } from '../../__mocks__';
import { noop } from '../../helpers';
import { useHoneyOverlay } from '../use-honey-overlay';
import { HoneyLayoutProvider } from '../../providers';
import { HoneyOverlay } from '../../components';
import type { HoneyKeyboardEventCode } from '../../types';

export const dispatchDocumentKeyboardEvent = (eventName: string, eventData?: KeyboardEventInit) => {
  document.dispatchEvent(new KeyboardEvent(eventName, eventData));
};

const customRender = (element: ReactElement) =>
  render(<HoneyLayoutProvider theme={themeMock}>{element}</HoneyLayoutProvider>);

describe('[useHoneyOverlay]: basic behavior', () => {
  it('should not expose the overlay instance when it is inactive', () => {
    const OverlayConsumer = () => {
      const overlay = useHoneyOverlay('test-overlay-id');

      return <div data-testid="overlay-id">{overlay?.id}</div>;
    };

    const { getByTestId } = customRender(
      <HoneyOverlay active={false} onDeactivate={noop} overlayId="test-overlay-id">
        <OverlayConsumer />
      </HoneyOverlay>,
    );

    expect(getByTestId('overlay-id')).not.toHaveTextContent('test-overlay-id');
  });

  it('should expose the overlay instance when it is active', () => {
    const OverlayConsumer = () => {
      const overlay = useHoneyOverlay('test-overlay-id');

      return <div data-testid="overlay-id">{overlay?.id}</div>;
    };

    const { getByTestId } = customRender(
      <HoneyOverlay active={true} onDeactivate={noop} overlayId="test-overlay-id">
        <OverlayConsumer />
      </HoneyOverlay>,
    );

    expect(getByTestId('overlay-id')).toHaveTextContent('test-overlay-id');
  });

  it('should call `onKeyUp` handler with "Space" key code when the key is pressed', () => {
    const keyUpSpy = jest.fn((keyCode: HoneyKeyboardEventCode) => {});

    const OverlayConsumer = () => {
      useHoneyOverlay('test-overlay-id', {
        onKeyUp: keyUpSpy,
      });

      return <></>;
    };

    customRender(
      <HoneyOverlay active={true} onDeactivate={noop} overlayId="test-overlay-id">
        <OverlayConsumer />
      </HoneyOverlay>,
    );

    dispatchDocumentKeyboardEvent('keyup', {
      code: 'Space',
    });

    expect(keyUpSpy.mock.calls[0][0]).toBe('Space');
  });

  it('should call `onDeactivate` handler when the "Escape" key is pressed', () => {
    const deactivateSpy = jest.fn();

    customRender(
      <HoneyOverlay active={true} onDeactivate={deactivateSpy} overlayId="test-overlay-id">
        1
      </HoneyOverlay>,
    );

    dispatchDocumentKeyboardEvent('keyup', {
      code: 'Escape',
    });

    expect(deactivateSpy).toHaveBeenCalled();
  });
});
