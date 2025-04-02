import React from 'react';
import { FloatingPortal } from '@floating-ui/react';
import type { FloatingPortalProps } from '@floating-ui/react';

/**
 * @see https://floating-ui.com/docs/floatingportal#props
 */
export interface HoneyPopupPortalProps extends FloatingPortalProps {
  /**
   * @default true
   */
  enabled?: boolean;
}

export const HoneyPopupPortal = ({ children, enabled = true, ...props }: HoneyPopupPortalProps) => {
  return enabled ? <FloatingPortal {...props}>{children}</FloatingPortal> : children;
};
