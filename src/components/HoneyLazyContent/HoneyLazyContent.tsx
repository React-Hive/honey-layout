import type { PropsWithChildren } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import type { TimeoutId } from '../../types';

export interface HoneyLazyContentProps {
  /**
   * Determines whether the content should be mounted or unmounted.
   */
  mount: boolean;
  /**
   * The delay in milliseconds before unmounting the content when `mount` is set to `false`.
   */
  unmountDelay: number;
  /**
   * Determines whether the content should always remain mounted, regardless of the value of `mount`.
   * If `true`, the content will never be unmounted.
   *
   * @default false
   */
  alwaysMounted?: boolean;
  /**
   * Determines whether the content should remain mounted after the mount.
   * If `true`, the content will not be unmounted after the time it's mounted.
   *
   * @default false
   */
  keepAfterMount?: boolean;
}

/**
 * Component for lazy loading/unloading content based on a mount/unmount state.
 */
export const HoneyLazyContent = ({
  children,
  mount,
  unmountDelay,
  alwaysMounted = false,
  keepAfterMount = false,
}: PropsWithChildren<HoneyLazyContentProps>) => {
  const [isMountContent, setIsMountContent] = useState(alwaysMounted || mount);

  const mountContentTimeoutIdRef = useRef<TimeoutId>(undefined);

  useLayoutEffect(() => {
    if (!mount || alwaysMounted) {
      return;
    }

    clearTimeout(mountContentTimeoutIdRef.current);

    setIsMountContent(true);

    return () => {
      if (!keepAfterMount) {
        mountContentTimeoutIdRef.current = setTimeout(() => setIsMountContent(false), unmountDelay);
      }
    };
  }, [mount, alwaysMounted, unmountDelay]);

  return isMountContent ? children : null;
};
