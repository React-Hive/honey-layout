import { useCallback, useEffect, useRef, useState } from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
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

import { useHoneyLayout, useHoneyOnChange } from '../../../hooks';
import { useHoneyPopupInteractions } from './use-honey-popup-interactions';
import type { Nullable } from '../../../types';
import type { UseHoneyPopupInteractionsOptions } from './use-honey-popup-interactions';

export interface UseHoneyPopupOptions<UseAutoSize extends boolean = boolean>
  extends UseHoneyPopupInteractionsOptions {
  open?: boolean;
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
   * Whether to show an arrow indicator.
   *
   * @default false
   */
  useArrow?: boolean;
  /**
   * Configuration for the floating arrow.
   */
  arrowOptions?: Omit<ArrowOptions, 'element'>;
  /**
   * @prop duration Default is 250.
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
   * @default false
   */
  useAutoSize?: UseAutoSize;
  /**
   * @default 0
   *
   * @remarks Only works when `useAutoSize` is `true`.
   */
  minAcceptableWidth?: number;
  /**
   * @default 0
   *
   * @remarks Only works when `useAutoSize` is `true`.
   */
  minAcceptableHeight?: number;
  /**
   * @default undefined
   *
   * @remarks Only works when `useAutoSize` is `true`.
   */
  maxAcceptableWidth?: number;
  /**
   * @default undefined
   *
   * @remarks Only works when `useAutoSize` is `true`.
   */
  maxAcceptableHeight?: number;
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
  enabled = true,
  event,
  dismissOptions,
  clickOptions,
  hoverOptions,
  focusOptions,
  clientPointsOptions,
  roleOptions,
  open,
  floatingOptions,
  offsetOptions,
  flipOptions,
  shiftOptions,
  useArrow = false,
  arrowOptions,
  transitionOptions,
  useAutoUpdate = false,
  autoUpdateOptions,
  useAutoSize = false,
  minAcceptableWidth = 0,
  minAcceptableHeight = 0,
  maxAcceptableWidth,
  maxAcceptableHeight,
  onOpen,
  onClose,
}: UseHoneyPopupOptions): UseHoneyPopupApi => {
  const { theme } = useHoneyLayout();

  const nodeId = useFloatingNodeId();

  const [isOpenLocal, setIsOpenLocal] = useState(false);

  const arrowRef = useRef<Nullable<SVGSVGElement>>(null);

  const isOpen = enabled && (open ?? isOpenLocal);

  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    }
  }, [isOpen]);

  useHoneyOnChange(enabled, enabled => {
    if (!enabled) {
      setIsOpenLocal(false);
    }
  });

  const closePopup = useCallback(() => {
    setIsOpenLocal(false);

    onClose?.();
  }, [onClose]);

  const middlewares: Middleware[] = [offset(offsetOptions ?? theme.spacings.base)];

  // https://floating-ui.com/docs/flip
  const flipMiddleware = flip({
    // https://floating-ui.com/docs/flip#combining-with-shift
    crossAxis: false,
    fallbackStrategy: 'bestFit',
    ...flipOptions,
  });

  if (useAutoSize) {
    // https://floating-ui.com/docs/size
    const sizeMiddleware = size({
      apply({ elements, rects, availableWidth, availableHeight }) {
        Object.assign(elements.floating.style, {
          minWidth: `${Math.max(minAcceptableWidth, rects.reference.width)}px`,
          minHeight: `${Math.max(minAcceptableHeight, rects.reference.height)}px`,
          maxWidth: `${Math.min(availableWidth, maxAcceptableWidth ?? Infinity)}px`,
          maxHeight: `${Math.min(availableHeight, maxAcceptableHeight ?? Infinity)}px`,
        });
      },
    });

    if (flipOptions?.fallbackStrategy === 'initialPlacement') {
      /**
       * If the initial placement to take precedence, place `size()` before `flip()`.
       *
       * @see https://floating-ui.com/docs/size#initialplacement
       */
      middlewares.push(sizeMiddleware, flipMiddleware);
    } else {
      /**
       * The `bestFit` fallback strategy in the `flip()` middleware is the default, which ensures
       * the best fitting placement is used.
       * In this scenario, place `size()` after `flip()`.
       *
       * @see https://floating-ui.com/docs/size#bestfit
       */
      middlewares.push(flipMiddleware, sizeMiddleware);
    }
  } else {
    middlewares.push(flipMiddleware);
  }

  middlewares.push(
    // https://floating-ui.com/docs/shift
    shift({
      padding: theme.spacings.base,
      ...shiftOptions,
    }),
  );

  if (useArrow) {
    /**
     * The `arrow()` should generally be placed toward the end of the middlewares,
     * after `shift()` or `autoPlacement()`.
     *
     * @see https://floating-ui.com/docs/arrow
     */
    middlewares.push(
      arrow({
        element: arrowRef,
        // https://floating-ui.com/docs/floatingarrow#arrow-does-not-avoid-rounded-corners
        padding: theme.spacings.base,
        ...arrowOptions,
      }),
    );
  }

  const floating = useFloating({
    nodeId,
    open: isOpen,
    middleware: middlewares,
    onOpenChange: setIsOpenLocal,
    // https://floating-ui.com/docs/usefloating#whileelementsmounted
    ...(useAutoUpdate && {
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, autoUpdateOptions),
    }),
    ...floatingOptions,
  });

  const interactions = useHoneyPopupInteractions(floating.context, {
    enabled,
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
