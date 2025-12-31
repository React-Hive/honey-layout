import { styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

import { __DEV__ } from '../../constants';
import { warnOnce } from '../../utils';
import { HoneyBox } from '../HoneyBox';
import type { HoneyBoxProps } from '../HoneyBox';

export type HoneyFlexProps<Element extends ElementType = 'div'> = HoneyBoxProps<Element> & {
  /**
   * Enables inline flex layout.
   *
   * When enabled, this prop applies:
   * - `display: inline-flex`
   *
   * When disabled (default), the layout uses:
   * - `display: flex`
   *
   * This is a semantic convenience prop intended for inline alignment scenarios
   * (e.g. buttons, badges, form controls).
   *
   * If `$display` is explicitly provided, it always takes precedence over this prop.
   *
   * @default false
   */
  inline?: boolean;
  /**
   * Enables horizontal (row-based) layout.
   *
   * When enabled, this prop applies:
   * - `flex-direction: row`
   *
   * When disabled (default), the layout uses:
   * - `flex-direction: column`
   *
   * This is a semantic convenience prop. If `$flexDirection` is explicitly provided,
   * it will always take precedence.
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
   * This prop is intended for common centering use cases and improves readability
   * over manually specifying flex styles.
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
   * Ignored if `center` is enabled or if the corresponding explicit style prop is provided.
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
   * Ignored if `center` is enabled or if the corresponding explicit style prop is provided.
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
 * - `inline` → switches layout to `inline-flex`
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
 * @example Inline layout
 * ```tsx
 * <HoneyFlex inline centerY>
 *   <Icon />
 *   <Text>Label</Text>
 * </HoneyFlex>
 * ```
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
    inline = false,
    row = false,
    center = false,
    centerX = false,
    centerY = false,
    $display,
    $flexDirection,
    $alignItems,
    $justifyContent,
    ...props
  }) => {
    const display = inline ? 'inline-flex' : ($display ?? 'flex');
    const flexDirection = $flexDirection ?? (row ? 'row' : 'column');
    const isRow = flexDirection === 'row';

    const shouldCenterAlignItems = center || (isRow ? centerY : centerX);
    const shouldCenterJustifyContent = center || (isRow ? centerX : centerY);

    const alignItems = $alignItems ?? (shouldCenterAlignItems ? 'center' : undefined);
    const justifyContent = $justifyContent ?? (shouldCenterJustifyContent ? 'center' : undefined);

    if (__DEV__) {
      const hasAlignConflict = shouldCenterAlignItems && $alignItems !== undefined;
      const hasJustifyConflict = shouldCenterJustifyContent && $justifyContent !== undefined;

      if (hasAlignConflict || hasJustifyConflict) {
        warnOnce(
          `HoneyFlex:${hasAlignConflict}:${hasJustifyConflict}`,
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
      $display: display,
      $flexDirection: flexDirection,
      $alignItems: alignItems,
      $justifyContent: justifyContent,
      // Data
      'data-testid': props['data-testid'] ?? 'honey-flex',
    };
  },
)``;
