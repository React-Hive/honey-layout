import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import { HoneyLazyContent } from '../HoneyLazyContent';

describe('[HoneyLazyContent]: basic behavior', () => {
  it('should not render content when `mount` is false', () => {
    const { queryByTestId } = render(
      <HoneyLazyContent mount={false} unmountDelay={0}>
        <div data-testid="content">Content</div>
      </HoneyLazyContent>,
    );

    expect(queryByTestId('content')).toBeNull();
  });

  it('should render content when `mount` is true', () => {
    const { queryByTestId } = render(
      <HoneyLazyContent mount={true} unmountDelay={0}>
        <div data-testid="content">Any content</div>
      </HoneyLazyContent>,
    );

    expect(queryByTestId('content')).toHaveTextContent('Any content');
  });

  it('should render content when `alwaysMounted` is true despite `mount` is false', () => {
    const { queryByTestId } = render(
      <HoneyLazyContent mount={false} alwaysMounted={true} unmountDelay={0}>
        <div data-testid="content">Any content</div>
      </HoneyLazyContent>,
    );

    expect(queryByTestId('content')).toHaveTextContent('Any content');
  });

  it('should unmount content after `unmountDelay`', async () => {
    const unmountDelay = 100;

    const { queryByTestId, rerender } = render(
      <HoneyLazyContent mount={true} unmountDelay={unmountDelay}>
        <div data-testid="content">Any content</div>
      </HoneyLazyContent>,
    );

    rerender(
      <HoneyLazyContent mount={false} unmountDelay={unmountDelay}>
        <div data-testid="content">Any content</div>
      </HoneyLazyContent>,
    );

    expect(queryByTestId('content')).toHaveTextContent('Any content');

    await waitFor(() => expect(queryByTestId('content')).toBeNull(), {
      timeout: unmountDelay + 50,
    });
  });

  it('should keep content when `keepAfterMount` is true', () => {
    jest.useFakeTimers();

    const { queryByTestId, rerender } = render(
      <HoneyLazyContent mount={true} keepAfterMount={true} unmountDelay={0}>
        <div data-testid="content">Any content</div>
      </HoneyLazyContent>,
    );

    rerender(
      <HoneyLazyContent mount={false} keepAfterMount={true} unmountDelay={0}>
        <div data-testid="content">Any content</div>
      </HoneyLazyContent>,
    );

    act(() => jest.advanceTimersByTime(100));

    expect(queryByTestId('content')).toHaveTextContent('Any content');

    jest.useRealTimers();
  });
});
