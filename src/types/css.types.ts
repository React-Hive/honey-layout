/**
 * The types for handling CSS properties and values, focusing on dimensions, colors, media queries, and other essential CSS concepts.
 */
import * as CSS from 'csstype';

export type HoneyCSSResolutionUnit = 'dpi' | 'dpcm' | 'dppx' | 'x';

export type HoneyCSSResolutionValue = `${number}${HoneyCSSResolutionUnit}`;

export type HoneyCSSMediaOrientation = 'landscape' | 'portrait';

type HoneyCSSAbsoluteDimensionUnit = 'px' | 'cm' | 'mm' | 'in' | 'pt' | 'pc';
type HoneyCSSRelativeDimensionUnit = 'em' | 'rem' | '%' | 'vh' | 'vw' | 'vmin' | 'vmax';

/**
 * Represents a CSS dimension unit, which can be either an absolute or relative.
 */
export type HoneyCSSDimensionUnit = HoneyCSSAbsoluteDimensionUnit | HoneyCSSRelativeDimensionUnit;

/**
 * Represents an array of CSS values, either 2, 3, or 4 values.
 *
 * @template T - Type of the value.
 */
export type HoneyCSSArrayValue<T> = [T, T] | [T, T, T] | [T, T, T, T];

/**
 * Represents a CSS value that can be either a single value or an array of values.
 *
 * @template T - Type of the value.
 */
export type HoneyCSSMultiValue<T> = T | HoneyCSSArrayValue<T>;

/**
 * Defining the allowed timing functions for the transition
 */
export type HoneyCSSTimingFunction = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Type representing CSS properties related to spacing and positioning.
 */
export type HoneyCSSDimensionProperty = keyof Pick<
  CSS.Properties,
  | 'width'
  | 'height'
  | 'margin'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
  | 'padding'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'gap'
  | 'rowGap'
  | 'columnGap'
>;

/**
 * Represents a subset of CSS properties that define color-related styles.
 */
export type HoneyCSSColorProperty = keyof Pick<
  CSS.Properties,
  | 'color'
  | 'backgroundColor'
  | 'borderColor'
  | 'borderTopColor'
  | 'borderRightColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
  | 'outlineColor'
  | 'textDecorationColor'
  | 'fill'
  | 'stroke'
>;

/**
 * Represents a specific CSS dimension value with a unit.
 */
export type HoneyCSSDimensionValue<Unit extends HoneyCSSDimensionUnit = HoneyCSSDimensionUnit> =
  `${number}${Unit}`;

/**
 * Type representing numeric values for CSS dimension properties.
 *
 * If `CSSProperty` extends `HoneyCSSDimensionProperty`, this type will be a single value or an array of numbers,
 * allowing for spacing properties that can have single or multiple numeric values (e.g., margin, padding).
 * Otherwise, it results in `never`, indicating that non-distance properties are not included.
 *
 * @template CSSProperty - The key of a CSS property to check.
 */
export type HoneyCSSDimensionNumericValue<CSSProperty extends keyof CSS.Properties> =
  CSSProperty extends HoneyCSSDimensionProperty ? HoneyCSSMultiValue<number> : never;

/**
 * Represents a shorthand CSS dimension value for 2, 3, or 4 values with the same unit.
 *
 * @template Value - Type of the value.
 * @template Unit - CSS length unit.
 */
export type HoneyCSSDimensionShortHandValue<
  Value,
  Unit extends HoneyCSSDimensionUnit,
> = Value extends [unknown, unknown]
  ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
  : Value extends [unknown, unknown, unknown]
    ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
    : Value extends [unknown, unknown, unknown, unknown]
      ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
      : never;

/**
 * Options for CSS @media at-rule.
 */
export type HoneyCSSMediaRule = {
  operator?: 'not' | 'only';
  mediaType?: 'all' | 'print' | 'screen' | 'speech';
  width?: HoneyCSSDimensionValue;
  minWidth?: HoneyCSSDimensionValue;
  maxWidth?: HoneyCSSDimensionValue;
  height?: HoneyCSSDimensionValue;
  minHeight?: HoneyCSSDimensionValue;
  maxHeight?: HoneyCSSDimensionValue;
  orientation?: HoneyCSSMediaOrientation;
  resolution?: HoneyCSSResolutionValue;
  minResolution?: HoneyCSSResolutionValue;
  maxResolution?: HoneyCSSResolutionValue;
  update?: 'none' | 'slow' | 'fast';
};
