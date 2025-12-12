import { styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

import { HoneyBox } from '../HoneyBox';
import type { HoneyBoxProps } from '../HoneyBox';

export type HoneyFlexProps<Element extends ElementType = 'div'> = HoneyBoxProps<Element> & {
  /**
   * @default false
   */
  row?: boolean;
};

/**
 * A flexible layout primitive built on top of {@link HoneyBox}.
 *
 * `HoneyFlex` is a convenience wrapper that enables flexbox layout by default
 * and provides sensible defaults for common use cases.
 *
 * Default behavior:
 * - `display`: `flex`
 * - `flexDirection`: `column`
 *
 * The component remains fully configurable via all {@link HoneyBoxProps},
 * allowing consumers to override any flexbox-related styles as needed.
 *
 * @example
 * ```tsx
 * <HoneyFlex gap={2} />
 *
 * <HoneyFlex $flexDirection="row" alignItems="center" />
 * ```
 */
export const HoneyFlex = styled<HoneyFlexProps>(
  HoneyBox,
  ({ row = false, $display = 'flex', $flexDirection = row ? 'row' : 'column', ...props }) => ({
    $display,
    $flexDirection,
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
