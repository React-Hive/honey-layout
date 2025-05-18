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
  ElementProps,
  ReferenceType,
  FloatingContext,
  UseDismissProps,
  UseClickProps,
  UseHoverProps,
  UseFocusProps,
  UseClientPointProps,
  UseRoleProps,
} from '@floating-ui/react';
import type { FastOmit } from '@react-hive/honey-style';

export type HoneyPopupExtraInteraction = <Props extends object>(
  context: FloatingContext,
  props?: Props,
) => ElementProps;

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
  dismissOptions?: FastOmit<UseDismissProps, 'escapeKey'>;
  /**
   * Configuration for click interactions.
   *
   * @see https://floating-ui.com/docs/useclick
   */
  clickOptions?: FastOmit<UseClickProps, 'enabled'>;
  /**
   * Configuration for hover interactions.
   *
   * @prop restMs Default is 150.
   * @prop handleClose Default is `safePolygon()`.
   *
   * @see https://floating-ui.com/docs/usehover
   */
  hoverOptions?: FastOmit<UseHoverProps, 'enabled'>;
  /**
   * Configuration for focus interactions.
   *
   * @see https://floating-ui.com/docs/usefocus
   */
  focusOptions?: FastOmit<UseFocusProps, 'enabled'>;
  /**
   * Configuration for pointer interactions.
   *
   * @see https://floating-ui.com/docs/useclientpoint
   */
  clientPointsOptions?: FastOmit<UseClientPointProps, 'enabled'>;
  /**
   * Configuration for role assignment.
   *
   * @see https://floating-ui.com/docs/userole
   */
  roleOptions?: FastOmit<UseRoleProps, 'enabled'>;
  /**
   * Additional custom interactions to be merged with default ones.
   * Useful for extending or overriding the default behavior.
   *
   * To define custom interaction, please use the ` HoneyPopupExtraInteraction ` type.
   *
   * @default []
   *
   * @see https://floating-ui.com/docs/custom-hooks
   */
  extraInteractions?: ElementProps[];
}

export const useHoneyPopupInteractions = <Reference extends ReferenceType>(
  context: FloatingContext<Reference>,
  {
    enabled = true,
    event = 'click',
    dismissOptions,
    clickOptions,
    hoverOptions,
    focusOptions,
    clientPointsOptions,
    roleOptions,
    extraInteractions = [],
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

  return useInteractions([dismiss, click, hover, focus, clientPoint, role, ...extraInteractions]);
};
