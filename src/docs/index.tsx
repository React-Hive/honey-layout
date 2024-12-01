import React, { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { MDXProvider } from '@mdx-js/react';
import { StyleSheetManager } from 'styled-components';

import type { HoneyTheme } from '../types';
import { App } from './App';
import { theme } from './theme';
import { shouldForwardProp } from '../helpers';
import { HoneyLayoutProvider } from '../providers';
import { GlobalStyle } from './global-style';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends HoneyTheme {}
}

const root = createRoot(document.getElementById('root') as HTMLDivElement);

const router = createBrowserRouter([
  {
    path: '/*',
    element: (
      <StrictMode>
        <App />
      </StrictMode>
    ),
  },
]);

root.render(
  <HoneyLayoutProvider theme={theme}>
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <GlobalStyle />

      <MDXProvider>
        <RouterProvider router={router} />
      </MDXProvider>
    </StyleSheetManager>
  </HoneyLayoutProvider>,
);
