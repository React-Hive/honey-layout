import React from 'react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

import { themeMock } from '../../../__mocks__';
import { HoneyLayoutProvider } from '../../../providers';
import { HoneyList } from '../HoneyList';

const generateItems = (length: number) =>
  Array.from({ length }).map((_, index) => ({
    id: index,
    name: `name-${index}`,
  }));

const customRender = (element: ReactElement) =>
  render(<HoneyLayoutProvider theme={themeMock}>{element}</HoneyLayoutProvider>);

describe('[HoneyList]: basic behavior', () => {
  it('should render a list of primitive values', () => {
    const items = [1, 2, 3];

    const { getByTestId } = customRender(<HoneyList items={items}>{item => item}</HoneyList>);

    expect(getByTestId('honey-list')).toHaveTextContent(items.join(''));
  });

  it('should render a list of objects no using `itemKey`', () => {
    const items = generateItems(3);

    const { getByTestId } = customRender(<HoneyList items={items}>{item => item.name}</HoneyList>);

    expect(getByTestId('honey-list')).toHaveTextContent(items.map(item => item.name).join(''));
  });

  it('should render a list with key derived from object `id` property', () => {
    const items = generateItems(3);

    const { getByTestId } = customRender(
      <HoneyList items={items} itemKey="id">
        {item => item.name}
      </HoneyList>,
    );

    expect(getByTestId('honey-list')).toHaveTextContent(items.map(item => item.name).join(''));
  });

  it('should render a list with key derived from custom function using object `id`', () => {
    const items = generateItems(3);

    const { getByTestId } = customRender(
      <HoneyList items={items} itemKey={item => item.id.toString()}>
        {item => item.name}
      </HoneyList>,
    );

    expect(getByTestId('honey-list')).toHaveTextContent(items.map(item => item.name).join(''));
  });
});
