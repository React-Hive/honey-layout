import { useCallback, useEffect, useRef, useState } from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  useFloatingNodeId,
  useTransitionStyles,
} from '@floating-ui/react';
import type { RefObject } from 'react';
import type {
  AutoUpdateOptions,
  ArrowOptions,
  FlipOptions,
  OffsetOptions,
  ShiftOptions,
  Middleware,
  UseFloatingOptions,
  UseFloatingReturn,
  UseInteractionsReturn,
  UseTransitionStylesProps,
} from '@floating-ui/react';

import { useHoneyLayout } from '../../../hooks';
import { useHoneyPopupInteractions } from './use-honey-popup-interactions';
import type { Nullable } from '../../../types';
import type { UseHoneyPopupInteractionsOptions } from './use-honey-popup-interactions';

export interface UseHoneyPopupOptions extends UseHoneyPopupInteractionsOptions {
  open?: boolean;
  /**
   * Configuration for the floating arrow.
   */
  arrowOptions?: Omit<ArrowOptions, 'element'>;
  /**
   * Options for configuring the floating UI behavior.
   */
  floatingOptions?: Omit<
    UseFloatingOptions,
    'nodeId' | 'open' | 'whileElementsMounted' | 'onOpenChange'
  >;
  /**
   * Configuration for offset middleware.
   *
   * @see https://floating-ui.com/docs/offset
   */
  offsetOptions?: OffsetOptions;
  /**
   * Configuration for flip middleware.
   *
   * @prop crossAxis - Default is `false`.
   *  See details by https://floating-ui.com/docs/flip#combining-with-shift
   */
  flipOptions?: FlipOptions;
  /**
   * Configuration for shift middleware.
   *
   * @see https://floating-ui.com/docs/shift
   */
  shiftOptions?: ShiftOptions;
  /**
   * @prop duration - Default is 250.
   *
   * @see https://floating-ui.com/docs/usetransition#usetransitionstyles
   */
  transitionOptions?: UseTransitionStylesProps;
  /**
   * Whether to use automatic position updates.
   *
   * @default false
   */
  useAutoUpdate?: boolean;
  /**
   * Configuration for auto-update behavior.
   *
   * @see https://floating-ui.com/docs/autoupdate
   */
  autoUpdateOptions?: AutoUpdateOptions;
  /**
   * Callback invoked when the popup opens.
   */
  onOpen?: () => void;
  /**
   * Callback invoked when the popup closes.
   */
  onClose?: () => void;
}

interface UseHoneyPopupApi {
  /**
   * Unique identifier for the floating element.
   */
  nodeId: string | undefined;
  /**
   * Whether the popup is currently open.
   */
  isOpen: boolean;
  /**
   * Floating UI instance with positioning and middleware.
   */
  floating: UseFloatingReturn;
  /**
   * Ref for the floating arrow element.
   */
  arrowRef: RefObject<Nullable<SVGSVGElement>>;
  /**
   * Event handlers for the popup (click, hover, etc.).
   */
  interactions: UseInteractionsReturn;
  transition: ReturnType<typeof useTransitionStyles>;
  /**
   * Function to manually close the popup.
   */
  closePopup: () => void;
}

/**
 * Hook for managing a floating popup with customizable behavior.
 *
 * @param options - Configuration options for the popup.
 *
 * @returns An object containing state and utilities for managing the popup.
 */
export const useHoneyPopup = ({
  event,
  dismissOptions,
  clickOptions,
  hoverOptions,
  focusOptions,
  clientPointsOptions,
  roleOptions,
  open,
  arrowOptions,
  floatingOptions,
  offsetOptions,
  flipOptions,
  shiftOptions,
  transitionOptions,
  useAutoUpdate = false,
  autoUpdateOptions,
  onOpen,
  onClose,
}: UseHoneyPopupOptions): UseHoneyPopupApi => {
  const { theme } = useHoneyLayout();

  const nodeId = useFloatingNodeId();

  const [isOpenLocal, setIsOpen] = useState(false);

  const arrowRef = useRef<Nullable<SVGSVGElement>>(null);

  const isOpen = open ?? isOpenLocal;

  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    }
  }, [isOpen]);

  const closePopup = useCallback(() => {
    setIsOpen(false);

    onClose?.();
  }, [onClose]);

  const middlewares: Middleware[] = [
    // https://floating-ui.com/docs/arrow
    arrow({
      element: arrowRef,
      // https://floating-ui.com/docs/floatingarrow#arrow-does-not-avoid-rounded-corners
      padding: theme.spacings.base,
      ...arrowOptions,
    }),
    offset(offsetOptions ?? theme.spacings.base),
    // https://floating-ui.com/docs/flip
    flip({
      // https://floating-ui.com/docs/flip#combining-with-shift
      crossAxis: false,
      ...flipOptions,
    }),
    // https://floating-ui.com/docs/shift
    shift({
      padding: theme.spacings.base,
      ...shiftOptions,
    }),
  ];

  const floating = useFloating({
    nodeId,
    open: isOpen,
    middleware: middlewares,
    onOpenChange: setIsOpen,
    // https://floating-ui.com/docs/usefloating#whileelementsmounted
    ...(useAutoUpdate && {
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, autoUpdateOptions),
    }),
    ...floatingOptions,
  });

  const interactions = useHoneyPopupInteractions(floating.context, {
    event,
    dismissOptions,
    clickOptions,
    hoverOptions,
    focusOptions,
    clientPointsOptions,
    roleOptions,
  });

  const transition = useTransitionStyles(floating.context, {
    duration: 250,
    ...transitionOptions,
  });

  return {
    nodeId,
    isOpen,
    floating,
    arrowRef,
    interactions,
    transition,
    closePopup,
  };
};
