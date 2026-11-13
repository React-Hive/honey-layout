import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import type { ReactElement } from 'react';

import { themeMock } from '../../../__mocks__';
import { HoneyLayoutProvider } from '../../../providers';
import { HoneyPopup } from '../HoneyPopup';

const customRender = (element: ReactElement) =>
  render(<HoneyLayoutProvider theme={themeMock}>{element}</HoneyLayoutProvider>);

describe('[HoneyPopup]: basic behavior', () => {
  it('should render popup and toggle floating content on click', () => {
    const { getByTestId, queryByTestId } = customRender(
      <HoneyPopup content="Popup content">open</HoneyPopup>,
    );

    expect(getByTestId('honey-popup')).toBeInTheDocument();
    expect(queryByTestId('honey-popup-floating-content')).not.toBeInTheDocument();

    fireEvent.click(getByTestId('honey-popup'));

    expect(getByTestId('honey-popup-floating-content')).toBeInTheDocument();
  });
});

describe('[HoneyPopup]: Escape', () => {
  it('should close a popup that keeps its own open state, and tell onClose why', async () => {
    const onClose = vi.fn();

    const { getByTestId, queryByTestId } = customRender(
      <HoneyPopup content="Popup content" onClose={onClose}>
        open
      </HoneyPopup>,
    );

    fireEvent.click(getByTestId('honey-popup'));

    const floatingContent = getByTestId('honey-popup-floating-content');

    fireEvent.keyUp(floatingContent, { key: 'Escape', code: 'Escape' });

    await waitFor(() =>
      expect(queryByTestId('honey-popup-floating-content')).not.toBeInTheDocument(),
    );

    expect(onClose).toHaveBeenCalledWith('escape-key', undefined);
  });
});
