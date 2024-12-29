import React from 'react';
import type { MDXComponents } from 'mdx/types';

import type { Page } from './types';
import { MDXWrapper } from './components/MDXWrapper';

import GettingStartedPage from './pages/getting-started.page.mdx';
import HoneyLayoutProviderPage from './pages/honey-layout-provider.page.mdx';
import ThematizationPage from './pages/thematization.page.mdx';
import HoneyBoxPage from './pages/honey-box.page.mdx';
import HoneyGridPage from './pages/honey-grid.page.mdx';
import HoneyListPage from './pages/honey-list.page.mdx';
import HoneyLoopingListPage from './pages/honey-looping-list.page.mdx';
import HoneyLazyContentPage from './pages/honey-lazy-content.page.mdx';
import UtilsPage from './pages/utils.page.mdx';

// function getAnchor(text: string) {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9 ]/g, '')
//     .replace(/[ ]/g, '-');
// }
//
// const H2 = ({ children }: PropsWithChildren) => {
//   const anchor = getAnchor(children as string);
//
//   return (
//     <h2 id={anchor}>
//       <a href={`#${anchor}`} className="anchor-link">
//         §
//       </a>
//
//       {children}
//     </h2>
//   );
// };

const MDX_COMPONENTS: MDXComponents = {
  wrapper: MDXWrapper,
  // h2: H2,
};

export const PAGES: Page[] = [
  {
    path: 'getting-started',
    menuLabel: 'Getting Started',
    element: <GettingStartedPage components={MDX_COMPONENTS} />,
  },
  {
    path: 'layout-provider',
    menuLabel: 'Layout Provider',
    element: <HoneyLayoutProviderPage components={MDX_COMPONENTS} />,
  },
  {
    path: 'thematization',
    menuLabel: 'Thematization',
    element: <ThematizationPage components={MDX_COMPONENTS} />,
  },
  {
    path: 'box',
    menuLabel: 'Box',
    element: <HoneyBoxPage components={MDX_COMPONENTS} />,
  },
  {
    path: 'lazy-content',
    menuLabel: 'Lazy Content',
    element: <HoneyLazyContentPage components={MDX_COMPONENTS} />,
  },
  {
    path: 'grid',
    menuLabel: 'Grid',
    element: <HoneyGridPage components={MDX_COMPONENTS} />,
  },
  {
    path: 'list',
    menuLabel: 'List',
    element: <HoneyListPage components={MDX_COMPONENTS} />,
  },
  // {
  //   path: 'looping-list',
  //   menuLabel: 'Looping List',
  //   element: <HoneyLoopingListPage components={MDX_COMPONENTS} />,
  // },
  {
    path: 'utils',
    menuLabel: 'Utils',
    element: <UtilsPage components={MDX_COMPONENTS} />,
  },
];
