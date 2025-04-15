import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';

import { themeMock } from '../../../__mocks__';
import { HoneyLayoutProvider } from '../../../providers';
import { HoneyPopup } from '../HoneyPopup';

const customRender = (element: ReactElement) =>
  render(<HoneyLayoutProvider theme={themeMock}>{element}</HoneyLayoutProvider>);

describe('[HoneyPopup]: basic behavior', () => {
  it('should render popup and toggle floating content on click', () => {
    const { getByTestId, queryByTestId } = customRender(
      <HoneyPopup content="Popup content">
        {({ referenceProps }) => (
          <div {...referenceProps} data-testid="open-popup">
            open
          </div>
        )}
      </HoneyPopup>,
    );

    expect(getByTestId('honey-popup')).toBeInTheDocument();
    expect(queryByTestId('honey-popup-floating-content')).not.toBeInTheDocument();

    fireEvent.click(getByTestId('open-popup'));

    expect(getByTestId('honey-popup-floating-content')).toBeInTheDocument();
  });
});
