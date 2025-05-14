import React from 'react';
import { FloatingTree, useFloatingParentNodeId } from '@floating-ui/react';
import type { FloatingTreeProps } from '@floating-ui/react';

/**
 * @see https://floating-ui.com/docs/floatingtree
 */
interface HoneyPopupTreeProps extends FloatingTreeProps {
  /**
   * Whether to render the `FloatingTree` component.
   * Automatically disables if there is a parent floating node.
   *
   * @default true
   */
  enabled?: boolean;
}

/**
 * Wrapper component for `FloatingTree` that conditionally renders based on whether there is a parent floating node.
 *
 * @see https://floating-ui.com/docs/floatingtree
 */
export const HoneyPopupTree = ({ children, enabled = true, ...props }: HoneyPopupTreeProps) => {
  const parentNodeId = useFloatingParentNodeId();

  if (!enabled || parentNodeId) {
    return children;
  }

  return <FloatingTree {...props}>{children}</FloatingTree>;
};
