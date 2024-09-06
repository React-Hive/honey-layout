import React from 'react';

import { HoneyLayoutProvider, useHoneyLayout } from '../../../providers';
import { HoneyBox } from '../../../components';
import theme from './theme';

export const Main = () => {
  const { screenState, resolveColor, resolveSpacing } = useHoneyLayout();

  return (
    <HoneyBox as="ol">
      <li>
        Screen State: <pre>{JSON.stringify(screenState, null, 2)}</pre>
      </li>
      <li>resolveColor('neutral.charcoalDark') // {resolveColor('neutral.charcoalDark')}</li>
      <li>resolveSpacing([1, 2.5]) // {resolveSpacing([1, 2.5])}</li>
    </HoneyBox>
  );
};

export const HoneyLayoutProviderExample = () => {
  return (
    <HoneyLayoutProvider theme={theme}>
      <Main />
    </HoneyLayoutProvider>
  );
};
