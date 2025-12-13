import { styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

import { HoneyBox } from '../HoneyBox';
import type { HoneyBoxProps } from '../HoneyBox';

export type HoneyFlexProps<Element extends ElementType = 'div'> = HoneyBoxProps<Element> & {
  /**
   * Enables horizontal (row) layout.
   *
   * When `true`, applies:
   * - `flex-direction: row`
   *
   * When `false` (default), applies:
   * - `flex-direction: column`
   *
   * This prop is a semantic shortcut and can be overridden
   * by explicitly providing `$flexDirection`.
   *
   * @default false
   */
  row?: boolean;
  /**
   * Centers children along both axes.
   *
   * When enabled, applies:
   * - `align-items: center`
   * - `justify-content: center`
   *
   * This is a semantic convenience prop intended for common
   * centering scenarios. Explicit style props such as
   * `$alignItems` or `$justifyContent` will always take precedence.
   *
   * @default false
   */
  center?: boolean;
};

/**
 * A flexbox-based layout primitive built on top of {@link HoneyBox}.
 *
 * `HoneyFlex` provides a minimal, opinionated flex container with sensible
 * defaults, while remaining fully customizable via standard Honey style props.
 *
 * ### Default behavior
 * - `display: flex`
 * - `flex-direction: column`
 *
 * ### Semantic helpers
 * - `row` → switches layout to a horizontal flow
 * - `center` → centers content on both axes
 *
 * Semantic helpers are designed for convenience and readability.
 * Any explicitly provided style props always take precedence.
 *
 * @remarks
 * This component is intended to be the primary flex layout primitive
 * within the Honey design system and should be preferred over raw
 * flexbox usage for consistency.
 *
 * @example Basic column layout
 * ```tsx
 * <HoneyFlex $gap={2} />
 * ```
 *
 * @example Horizontal layout
 * ```tsx
 * <HoneyFlex row $gap={3} />
 * ```
 *
 * @example Fully centered content
 * ```tsx
 * <HoneyFlex $minHeight="100vh" center>
 *   <Spinner />
 * </HoneyFlex>
 * ```
 */
export const HoneyFlex = styled<HoneyFlexProps>(
  HoneyBox,
  ({
    row = false,
    center = false,
    $display = 'flex',
    $flexDirection = row ? 'row' : 'column',
    $alignItems = center ? 'center' : undefined,
    $justifyContent = !row && center ? 'center' : undefined,
    ...props
  }) => ({
    $display,
    $flexDirection,
    $alignItems,
    $justifyContent,
    // Data
    'data-testid': props['data-testid'] ?? 'honey-flex',
  }),
)``;

/**
 * @deprecated Use {@link HoneyFlexProps} instead.
 *
 * This alias exists for backward compatibility and will be removed in a future major release.
 */
export type HoneyFlexBoxProps = HoneyFlexProps;

/**
 * @deprecated Use {@link HoneyFlex} instead.
 *
 * This alias exists for backward compatibility and will be removed in a future major release.
 */
export const HoneyFlexBox = HoneyFlex;
