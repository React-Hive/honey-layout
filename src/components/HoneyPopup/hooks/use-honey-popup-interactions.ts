import {
  safePolygon,
  useClick,
  useClientPoint,
  useDismiss,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import type {
  FloatingContext,
  UseDismissProps,
  UseClickProps,
  UseHoverProps,
  UseFocusProps,
  UseClientPointProps,
  UseRoleProps,
} from '@floating-ui/react';

/**
 * Options for configuring popup interactions.
 */
export interface UseHoneyPopupInteractionsOptions {
  /**
   * @default true
   */
  enabled?: boolean;
  /**
   * Determines the trigger event for opening the popup.
   *
   * @default 'click'
   */
  event?: 'click' | 'hover' | 'focus' | 'point' | 'manual';
  /**
   * Configuration for dismiss behavior.
   *
   * @see https://floating-ui.com/docs/usedismiss
   */
  dismissOptions?: Omit<UseDismissProps, 'escapeKey'>;
  /**
   * Configuration for click interactions.
   *
   * @see https://floating-ui.com/docs/useclick
   */
  clickOptions?: Omit<UseClickProps, 'enabled'>;
  /**
   * Configuration for hover interactions.
   *
   * @prop restMs Default is 150.
   * @prop handleClose Default is `safePolygon()`.
   *
   * @see https://floating-ui.com/docs/usehover
   */
  hoverOptions?: Omit<UseHoverProps, 'enabled'>;
  /**
   * Configuration for focus interactions.
   *
   * @see https://floating-ui.com/docs/usefocus
   */
  focusOptions?: Omit<UseFocusProps, 'enabled'>;
  /**
   * Configuration for pointer interactions.
   *
   * @see https://floating-ui.com/docs/useclientpoint
   */
  clientPointsOptions?: Omit<UseClientPointProps, 'enabled'>;
  /**
   * Configuration for role assignment.
   *
   * @see https://floating-ui.com/docs/userole
   */
  roleOptions?: Omit<UseRoleProps, 'enabled'>;
}

export const useHoneyPopupInteractions = (
  context: FloatingContext,
  {
    enabled = true,
    event = 'click',
    dismissOptions,
    clickOptions,
    hoverOptions,
    focusOptions,
    clientPointsOptions,
    roleOptions,
  }: UseHoneyPopupInteractionsOptions,
) => {
  const dismiss = useDismiss(context, {
    escapeKey: false,
    ...dismissOptions,
  });

  const click = useClick(context, {
    enabled: enabled && event === 'click',
    ...clickOptions,
  });

  const hover = useHover(context, {
    restMs: 150,
    enabled: enabled && event === 'hover',
    handleClose: safePolygon(),
    ...hoverOptions,
  });

  const focus = useFocus(context, {
    enabled: enabled && event === 'focus',
    ...focusOptions,
  });

  const clientPoint = useClientPoint(context, {
    enabled: enabled && event === 'point',
    ...clientPointsOptions,
  });

  const role = useRole(context, roleOptions);

  return useInteractions([dismiss, click, hover, focus, clientPoint, role]);
};
