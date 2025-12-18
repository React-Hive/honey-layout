import { styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

import { __DEV__ } from '../../constants';
import { HoneyBox } from '../HoneyBox';
import type { HoneyBoxProps } from '../HoneyBox';

export type HoneyFlexProps<Element extends ElementType = 'div'> = HoneyBoxProps<Element> & {
  /**
   * Enables horizontal (row-based) layout.
   *
   * When enabled, this prop applies:
   * - `flex-direction: row`
   *
   * When disabled (default), the layout uses:
   * - `flex-direction: column`
   *
   * This is a semantic convenience prop. If `$flexDirection`
   * is explicitly provided, it will always take precedence.
   *
   * @default false
   */
  row?: boolean;
  /**
   * Centers children along both the main and cross axes.
   *
   * When enabled, this applies:
   * - `align-items: center`
   * - `justify-content: center`
   *
   * This prop is intended for common centering use cases and
   * improves readability over manually specifying flex styles.
   *
   * Explicit style props (`$alignItems`, `$justifyContent`)
   * always override this behavior.
   *
   * @default false
   */
  center?: boolean;
  /**
   * Centers children along the horizontal axis.
   *
   * - In column layouts: maps to `align-items: center`
   * - In row layouts: maps to `justify-content: center`
   *
   * Ignored if `center` is enabled or if the corresponding
   * explicit style prop is provided.
   *
   * @default false
   */
  centerX?: boolean;
  /**
   * Centers children along the vertical axis.
   *
   * - In column layouts: maps to `justify-content: center`
   * - In row layouts: maps to `align-items: center`
   *
   * Ignored if `center` is enabled or if the corresponding
   * explicit style prop is provided.
   *
   * @default false
   */
  centerY?: boolean;
};

/**
 * A flexbox-based layout primitive built on top of {@link HoneyBox}.
 *
 * `HoneyFlex` is the canonical flex container within the Honey design system.
 * It provides sensible defaults, readable semantic helpers, and full access
 * to low-level flexbox customization when needed.
 *
 * ---
 *
 * ### Default behavior
 * - `display: flex`
 * - `flex-direction: column`
 *
 * ---
 *
 * ### Semantic helpers
 * - `row` → switches layout to horizontal flow
 * - `center` → centers content on both axes
 * - `centerX`, `centerY` → axis-aware centering helpers
 *
 * Semantic helpers exist purely for convenience and readability.
 * Any explicitly provided style props **always take precedence**.
 *
 * ---
 *
 * @remarks
 * This component is intended to be the primary flex layout primitive
 * in the Honey ecosystem. Prefer it over raw flexbox usage to ensure
 * consistent behavior, defaults, and testability.
 *
 * ---
 *
 * @example Horizontal layout
 * ```tsx
 * <HoneyFlex $gap={2} row/>
 * ```
 *
 * @example Column layout
 * ```tsx
 * <HoneyFlex $gap={3} />
 * ```
 *
 * @example Centered fullscreen container
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
    centerX = false,
    centerY = false,
    $display = 'flex',
    $flexDirection = row ? 'row' : 'column',
    $alignItems,
    $justifyContent,
    ...props
  }) => {
    const affectsAlignItems = center || (row ? centerY : centerX);
    const affectsJustifyContent = center || (row ? centerX : centerY);

    if (__DEV__) {
      const hasAlignConflict = affectsAlignItems && $alignItems !== undefined;
      const hasJustifyConflict = affectsJustifyContent && $justifyContent !== undefined;

      if (hasAlignConflict || hasJustifyConflict) {
        console.warn(
          [
            '[@react-hive/honey-layout]: HoneyFlex.',
            'Semantic centering props conflict with explicit flex alignment styles:',
            hasAlignConflict && `   - align-items is controlled by both semantics and $alignItems`,
            hasJustifyConflict &&
              `   - justify-content is controlled by both semantics and $justifyContent`,
            'Explicit styles always win. Remove one side to silence this warning.',
          ]
            .filter(Boolean)
            .join('\n'),
        );
      }
    }

    return {
      $display,
      $flexDirection,
      $alignItems: $alignItems ?? (affectsAlignItems ? 'center' : undefined),
      $justifyContent: $justifyContent ?? (affectsJustifyContent ? 'center' : undefined),
      // Data
      'data-testid': props['data-testid'] ?? 'honey-flex',
    };
  },
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
