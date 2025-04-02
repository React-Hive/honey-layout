import { useCallback, useEffect, useRef, useState } from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useClientPoint,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import type { MutableRefObject } from 'react';
import type {
  AutoUpdateOptions,
  ArrowOptions,
  FlipOptions,
  OffsetOptions,
  ShiftOptions,
  UseClickProps,
  UseDismissProps,
  UseFloatingOptions,
  UseHoverProps,
  UseRoleProps,
  UseFocusProps,
  UseFloatingReturn,
  UseInteractionsReturn,
  UseClientPointProps,
  UseTransitionStylesProps,
} from '@floating-ui/react';

import { useHoneyLayout } from '../../../hooks';
import type { Nullable } from '../../../types';

export interface UseHoneyPopupOptions {
  open?: boolean;
  /**
   * Determines the trigger event for opening the popup.
   *
   * @default 'click'
   */
  event?: 'click' | 'hover' | 'focus' | 'point' | 'manual';
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
   */
  offsetOptions?: OffsetOptions;
  /**
   * Configuration for flip middleware.
   */
  flipOptions?: FlipOptions;
  /**
   * Configuration for shift middleware.
   */
  shiftOptions?: ShiftOptions;
  /**
   * Configuration for dismiss behavior.
   */
  dismissOptions?: Omit<UseDismissProps, 'enabled' | 'escapeKey'>;
  /**
   * Configuration for click interactions.
   */
  clickOptions?: Omit<UseClickProps, 'enabled'>;
  /**
   * Configuration for hover interactions.
   */
  hoverOptions?: Omit<UseHoverProps, 'enabled'>;
  /**
   * Configuration for focus interactions.
   */
  focusOptions?: Omit<UseFocusProps, 'enabled'>;
  clientPointsOptions?: Omit<UseClientPointProps, 'enabled'>;
  /**
   * Configuration for role assignment.
   */
  roleOptions?: Omit<UseRoleProps, 'enabled'>;
  transitionOptions?: UseTransitionStylesProps;
  /**
   * Whether to use automatic position updates.
   *
   * @default false
   */
  useAutoUpdate?: boolean;
  /**
   * Configuration for auto-update behavior.
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
  arrowRef: MutableRefObject<Nullable<SVGSVGElement>>;
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
  open,
  event = 'click',
  arrowOptions,
  floatingOptions,
  offsetOptions,
  flipOptions,
  shiftOptions,
  dismissOptions,
  clickOptions,
  hoverOptions,
  focusOptions,
  clientPointsOptions,
  roleOptions,
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

  const floating = useFloating({
    nodeId,
    open: isOpen,
    middleware: [
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
        crossAxis: false,
        ...flipOptions,
      }),
      // https://floating-ui.com/docs/shift
      shift({
        padding: theme.spacings.base,
        ...shiftOptions,
      }),
    ],
    onOpenChange: setIsOpen,
    // https://floating-ui.com/docs/usefloating#whileelementsmounted
    ...(useAutoUpdate && {
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, autoUpdateOptions),
    }),
    ...floatingOptions,
  });

  const dismiss = useDismiss(floating.context, {
    escapeKey: false,
    ...dismissOptions,
  });

  const click = useClick(floating.context, {
    enabled: event === 'click',
    ...clickOptions,
  });

  const hover = useHover(floating.context, {
    restMs: 150,
    enabled: event === 'hover',
    ...hoverOptions,
  });

  const focus = useFocus(floating.context, {
    enabled: event === 'focus',
    ...focusOptions,
  });

  const clientPoint = useClientPoint(floating.context, {
    enabled: event === 'point',
    ...clientPointsOptions,
  });

  const role = useRole(floating.context, roleOptions);

  const interactions = useInteractions([dismiss, click, hover, focus, clientPoint, role]);

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
