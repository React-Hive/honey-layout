import type { MutableRefObject } from 'react';
import { useCallback, useRef } from 'react';

import type { Nullable } from '../types';

export type UseHoneyInfiniteScrollOnFetchMoreItems = () => void;

export const useHoneyInfiniteScroll = <
  ScrollableContainerElement extends HTMLElement,
  TargetElement extends HTMLElement,
>(
  containerRef: MutableRefObject<Nullable<ScrollableContainerElement>> | undefined,
  onFetchMoreItems: UseHoneyInfiniteScrollOnFetchMoreItems,
) => {
  const scrollableContainerRef = useRef<Nullable<ScrollableContainerElement>>(null);

  const intersectionObserverRef = useRef<Nullable<IntersectionObserver>>(null);
  const targetRef = useRef<Nullable<TargetElement>>(null);

  const assignIntersectionObserver = (
    scrollableContainer: Nullable<ScrollableContainerElement>,
    target: Nullable<TargetElement>,
  ) => {
    scrollableContainerRef.current = scrollableContainer;
    targetRef.current = target;

    if (!scrollableContainer) {
      return;
    }

    if (target) {
      const handleIntersection = ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          onFetchMoreItems();
        }
      };

      intersectionObserverRef.current = new IntersectionObserver(handleIntersection, {
        root: scrollableContainer,
        rootMargin: '0px',
        threshold: 0,
      });

      intersectionObserverRef.current.observe(target);
    } else if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();

      intersectionObserverRef.current = null;
    }
  };

  const scrollableContainerRefFn = useCallback(
    (scrollableContainer: Nullable<ScrollableContainerElement>) => {
      assignIntersectionObserver(scrollableContainer, targetRef.current);
    },
    [],
  );

  const targetRefFn = useCallback(
    (target: Nullable<TargetElement>) => {
      assignIntersectionObserver(scrollableContainerRef.current, target);
    },
    [scrollableContainerRef, onFetchMoreItems],
  );

  return {
    scrollableContainerRef: scrollableContainerRefFn,
    targetRef: targetRefFn,
  };
};
