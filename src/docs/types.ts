import type { ReactElement } from 'react';

export type Page = {
  path: string;
  menuLabel: string;
  element: ReactElement;
};
