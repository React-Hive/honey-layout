import React, { useMemo, useCallback } from 'react';
import { FloatingArrow, FloatingFocusManager, FloatingNode } from '@floating-ui/react';
import type { CSSProperties, ReactNode } from 'react';
import type {
  UseInteractionsReturn,
  FloatingArrowProps,
  FloatingFocusManagerProps,
  MiddlewareData,
} from '@floating-ui/react';
import type { FastOmit } from '@react-hive/honey-style';

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
  referenceProps: ReturnType<UseInteractionsReturn['getReferenceProps']>;
}

type InheritedHoneyOverlayProps = FastOmit<
  HoneyOverlayProps,
  'children' | 'active' | 'onDeactivate' | '$position'
>;

export interface HoneyPopupProps<Context = undefined, UseAutoSize extends boolean = boolean>
  extends UseHoneyPopupOptions<UseAutoSize> {
  children: (context: HoneyPopupChildrenContextProps) => ReactNode;
  referenceProps?: FastOmit<HoneyPopupStyledProps, 'children' | 'content'>;
  /**
   * Content inside the popup.
   */
  content: ReactNode | ((context: HoneyPopupContextProps<Context>) => ReactNode);
  /**
   * Additional props for the floating content.
   */
  contentProps?: UseAutoSize extends true
    ? // Omit `minWidth`, `minHeight`, `maxWidth` and `maxHeight` because they will be overwritten by size() middleware
      Omit<InheritedHoneyOverlayProps, '$minWidth' | '$minHeight' | '$maxWidth' | '$maxHeight'>
    : InheritedHoneyOverlayProps;
  /**
   * Props for managing focus inside the popup.
   *
   * @see https://floating-ui.com/docs/floatingfocusmanager#props
   */
  focusManagerProps?: FastOmit<FloatingFocusManagerProps, 'children' | 'context'>;
  /**
   * Properties for an arrow component.
   *
   * @see https://floating-ui.com/docs/FloatingArrow#props
   */
  arrowProps?: FastOmit<FloatingArrowProps, 'ref' | 'context'>;
  /**
   * Properties for `HoneyPopupPortal` component.
   */
  portalProps?: FastOmit<HoneyPopupPortalProps, 'children'>;
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
export const HoneyPopup = <Context = undefined, UseAutoSize extends boolean = boolean>({
  children,
  referenceProps,
  content,
  contentProps,
  focusManagerProps,
  arrowProps,
  portalProps,
  adjustStyles,
  context,
  ...popupOptions
}: HoneyPopupProps<Context, UseAutoSize>) => {
  const { useArrow, onClose } = popupOptions;

  const { nodeId, floating, isOpen, arrowRef, interactions, transition } =
    useHoneyPopup(popupOptions);

  const childrenContext: HoneyPopupChildrenContextProps = {
    referenceProps: interactions.getReferenceProps(),
  };

  const handleDeactivateOverlay = useCallback(() => {
    onClose?.('escape-key');
  }, [onClose]);

  const popupContext = useMemo<HoneyPopupContextProps<Context>>(
    () => ({
      context,
    }),
    [context],
  );

  return (
    <HoneyPopupTree>
      <HoneyPopupStyled
        ref={floating.refs.setReference}
        {...childrenContext.referenceProps}
        {...referenceProps}
        // Data
        data-testid="honey-popup"
      >
        <HoneyPopupContext value={popupContext}>
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
                    onDeactivate={handleDeactivateOverlay}
                    {...interactions.getFloatingProps()}
                    {...contentProps}
                    // Data
                    data-testid="honey-popup-floating-content"
                  >
                    {useArrow && (
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
        </HoneyPopupContext>
      </HoneyPopupStyled>
    </HoneyPopupTree>
  );
};
