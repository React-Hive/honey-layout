import { styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

import { HoneyBox } from '../HoneyBox';
import type { HoneyBoxProps } from '../HoneyBox';

export type HoneyFlexProps<Element extends ElementType = 'div'> = HoneyBoxProps<Element> & {
  /**
   * Enables horizontal (row) layout.
   *
   * When `true`, sets:
   * - `flex-direction: row`
   *
   * When `false` (default), uses:
   * - `flex-direction: column`
   *
   * @default false
   */
  row?: boolean;
  /**
   * Centers children both horizontally and vertically.
   *
   * When enabled, sets:
   * - `align-items: center`
   * - `justify-content: center`
   *
   * This is a semantic shortcut and can be overridden
   * by explicitly providing `$alignItems` or `$justifyContent`.
   *
   * @default false
   */
  center?: boolean;
};

/**
 * A flexbox-based layout primitive built on top of {@link HoneyBox}.
 *
 * `HoneyFlex` provides a minimal, opinionated default flex configuration
 * while remaining fully customizable through standard style props.
 *
 * ### Default behavior
 * - `display: flex`
 * - `flex-direction: column`
 *
 * ### Semantic helpers
 * - `row` → switches layout to horizontal flow
 * - `center` → centers content on both axes
 *
 * Explicit style props always take precedence over semantic helpers.
 *
 * @remarks
 * This component is intended to be the primary flex layout primitive
 * within the Honey design system.
 *
 * @example Basic column layout
 * ```tsx
 * <HoneyFlex gap={2} />
 * ```
 *
 * @example Horizontal layout
 * ```tsx
 * <HoneyFlex gap={3} row />
 * ```
 *
 * @example Fully centered content
 * ```tsx
 * <HoneyFlex minHeight="100vh" center>
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
    $justifyContent = center ? 'center' : undefined,
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
