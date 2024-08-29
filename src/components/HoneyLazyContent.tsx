import type { PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { TimeoutId } from '../types';

type HoneyLazyContentProps = {
  /**
   * Determines whether the content should be mounted or unmounted.
   */
  isMount: boolean;
  /**
   * The delay in milliseconds before unmounting the content when `isMount` is set to `false`.
   */
  unmountDelay: number;
  /**
   * Determines whether the content should always remain mounted, regardless of the value of `isMount`.
   * If `true`, the content will never be unmounted.
   *
   * @default false
   */
  isAlwaysMounted?: boolean;
  /**
   * Determines whether the content should remain mounted after the mount.
   * If `true`, the content will not be unmounted after the time it's mounted.
   *
   * @default false
   */
  isKeepAfterMount?: boolean;
};

/**
 * Component for lazy loading/unloading content based on a mount/unmount state.
 */
export const HoneyLazyContent = ({
  children,
  isMount,
  unmountDelay,
  isAlwaysMounted = false,
  isKeepAfterMount = false,
}: PropsWithChildren<HoneyLazyContentProps>) => {
  const [isMountContent, setIsMountContent] = useState(isAlwaysMounted || isMount);

  const mountContentTimeoutIdRef = useRef<TimeoutId | undefined>(undefined);

  useEffect(() => {
    if (!isMount || isAlwaysMounted) {
      return;
    }

    clearTimeout(mountContentTimeoutIdRef.current);

    setIsMountContent(true);

    return () => {
      if (!isKeepAfterMount) {
        mountContentTimeoutIdRef.current = setTimeout(() => setIsMountContent(false), unmountDelay);
      }
    };
  }, [isMount]);

  return isMountContent ? children : null;
};
