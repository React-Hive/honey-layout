import React, { useMemo } from 'react';
import { FloatingArrow, FloatingFocusManager, FloatingNode } from '@floating-ui/react';
import type { CSSProperties, ReactNode } from 'react';
import type {
  UseInteractionsReturn,
  FloatingArrowProps,
  FloatingFocusManagerProps,
  MiddlewareData,
} from '@floating-ui/react';

import { HoneyOverlay } from '../HoneyOverlay';
import { HoneyPopupContext } from './HoneyPopupContext';
import { HoneyPopupStyled } from './HoneyPopupStyled';
import { HoneyPopupPortal } from './HoneyPopupPortal';
import { HoneyPopupTree } from './HoneyPopupTree';
import { useHoneyPopup } from './hooks';
import type { HoneyPopupPortalProps } from './HoneyPopupPortal';
import type { HoneyPopupStyledProps } from './HoneyPopupStyled';
import type { HoneyPopupContextProps } from './HoneyPopupContext';
import type { UseHoneyPopupOptions } from './hooks';
import type { HoneyOverlayProps } from '../HoneyOverlay';

export interface HoneyPopupChildrenContextProps {
  getReferenceProps: UseInteractionsReturn['getReferenceProps'];
}

type InheritedHoneyOverlayProps = Omit<HoneyOverlayProps, 'children' | 'active' | 'onDeactivate'>;

export interface HoneyPopupProps<Context = undefined>
  extends Omit<HoneyPopupStyledProps, 'children' | 'content'>,
    UseHoneyPopupOptions {
  children: (context: HoneyPopupChildrenContextProps) => ReactNode;
  /**
   * Content inside the popup.
   */
  content: ReactNode | ((context: HoneyPopupContextProps<Context>) => ReactNode);
  /**
   * Additional props for the floating content.
   */
  contentProps?: InheritedHoneyOverlayProps;
  /**
   * Props for managing focus inside the popup.
   *
   * @see https://floating-ui.com/docs/floatingfocusmanager#props
   */
  focusManagerProps?: Omit<FloatingFocusManagerProps, 'children' | 'context'>;
  /**
   * Whether to show an arrow indicator.
   *
   * @default false
   */
  showArrow?: boolean;
  /**
   * Properties for an arrow component.
   *
   * @see https://floating-ui.com/docs/FloatingArrow#props
   */
  arrowProps?: Omit<FloatingArrowProps, 'ref' | 'context'>;
  /**
   * Properties for portal component.
   */
  portalProps?: Omit<HoneyPopupPortalProps, 'children'>;
  /**
   * Function to adjust the floating content's styles before rendering.
   */
  adjustStyles?: (
    styles: CSSProperties,
    executionContext: { middlewareData: MiddlewareData },
  ) => CSSProperties;
  /**
   * Optional context for the popup.
   */
  context?: Context;
}

/**
 * A popup component that provides floating behavior with customizable options.
 *
 * @template Context - Optional context type.
 */
export const HoneyPopup = <Context = undefined,>({
  children,
  content,
  contentProps,
  focusManagerProps,
  open,
  event,
  arrowOptions,
  floatingOptions,
  offsetOptions,
  shiftOptions,
  flipOptions,
  dismissOptions,
  clickOptions,
  hoverOptions,
  focusOptions,
  clientPointsOptions,
  roleOptions,
  transitionOptions,
  showArrow = false,
  useAutoUpdate,
  autoUpdateOptions,
  arrowProps,
  portalProps,
  adjustStyles,
  context,
  onOpen,
  onClose,
  ...props
}: HoneyPopupProps<Context>) => {
  const { nodeId, floating, isOpen, arrowRef, interactions, transition, closePopup } =
    useHoneyPopup({
      open,
      event,
      arrowOptions,
      floatingOptions,
      offsetOptions,
      shiftOptions,
      flipOptions,
      dismissOptions,
      clickOptions,
      hoverOptions,
      focusOptions,
      clientPointsOptions,
      roleOptions,
      transitionOptions,
      useAutoUpdate,
      autoUpdateOptions,
      onOpen,
      onClose,
    });

  const childrenContext: HoneyPopupChildrenContextProps = {
    getReferenceProps: interactions.getReferenceProps,
  };

  const popupContext = useMemo<HoneyPopupContextProps<Context>>(
    () => ({
      context,
      closePopup,
    }),
    [context, closePopup],
  );

  return (
    <HoneyPopupTree>
      <HoneyPopupStyled
        ref={floating.refs.setReference}
        {...interactions.getReferenceProps()}
        {...props}
        // Data
        data-testid="honey-popup"
      >
        <HoneyPopupContext.Provider value={popupContext}>
          {children(childrenContext)}

          <FloatingNode id={nodeId}>
            {transition.isMounted && (
              <HoneyPopupPortal {...portalProps}>
                <FloatingFocusManager
                  context={floating.context}
                  disabled={!isOpen}
                  {...focusManagerProps}
                >
                  <HoneyOverlay
                    ref={floating.refs.setFloating}
                    active={isOpen}
                    style={
                      adjustStyles?.(
                        {
                          ...floating.floatingStyles,
                          ...transition.styles,
                        },
                        {
                          middlewareData: floating.middlewareData,
                        },
                      ) ?? {
                        ...floating.floatingStyles,
                        ...transition.styles,
                      }
                    }
                    onDeactivate={closePopup}
                    {...interactions.getFloatingProps()}
                    {...contentProps}
                    // Data
                    data-testid="honey-popup-floating-content"
                  >
                    {showArrow && (
                      <FloatingArrow
                        ref={arrowRef}
                        context={floating.context}
                        fill="white"
                        {...arrowProps}
                      />
                    )}

                    {typeof content === 'function' ? content(popupContext) : content}
                  </HoneyOverlay>
                </FloatingFocusManager>
              </HoneyPopupPortal>
            )}
          </FloatingNode>
        </HoneyPopupContext.Provider>
      </HoneyPopupStyled>
    </HoneyPopupTree>
  );
};
