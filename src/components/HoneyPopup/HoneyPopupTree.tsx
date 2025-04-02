import React from 'react';
import { FloatingTree, useFloatingParentNodeId } from '@floating-ui/react';
import type { FloatingTreeProps } from '@floating-ui/react';

/**
 * @see https://floating-ui.com/docs/floatingtree
 */
export const HoneyPopupTree = ({ children, ...props }: FloatingTreeProps) => {
  const parentNodeId = useFloatingParentNodeId();

  return parentNodeId ? children : <FloatingTree {...props}>{children}</FloatingTree>;
};
