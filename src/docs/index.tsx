import React, { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { MDXProvider } from '@mdx-js/react';

import { App } from './App';
import { theme } from './theme';
import { HoneyLayoutProvider } from '../providers';
import { GlobalStyle } from './global-style';

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
    <GlobalStyle />

    <MDXProvider>
      <RouterProvider router={router} />
    </MDXProvider>
  </HoneyLayoutProvider>,
);
