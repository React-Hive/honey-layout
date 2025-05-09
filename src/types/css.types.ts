/**
 * The types for handling CSS properties and values, focusing on dimensions, colors, media queries, and other essential CSS concepts.
 */
import * as CSS from 'csstype';
import type {
  HoneyCSSDimensionUnit,
  HoneyBreakpointName,
  HoneyCSSDimensionValue,
  HoneyStyledContext,
  HoneyColor,
} from '@react-hive/honey-style';

/**
 * Represents the possible values for media query orientation.
 *
 * Used in responsive styles to target specific device orientations.
 *
 * - `'landscape'` – Width is greater than height.
 * - `'portrait'` – Height is greater than width.
 */
export type HoneyCSSMediaOrientation = 'landscape' | 'portrait';

/**
 * Represents CSS resolution units typically used in media queries.
 *
 * - `'dpi'` — dots per inch
 * - `'dpcm'` — dots per centimeter
 * - `'dppx'` — dots per pixel (e.g., 2dppx for Retina displays)
 * - `'x'` — resolution multiplier (e.g., 1x, 2x)
 */
export type HoneyCSSResolutionUnit = 'dpi' | 'dpcm' | 'dppx' | 'x';

/**
 * Represents a CSS resolution value, such as `'300dpi'`, `'2x'`, or `'1.5dppx'`.
 */
export type HoneyCSSResolutionValue = `${number}${HoneyCSSResolutionUnit}`;

/**
 * Represents a tuple of 2 to 4 values using standard CSS shorthand conventions.
 *
 * This type models how properties like `margin`, `padding`, `gap`, and `borderRadius`
 * can accept multiple values to control different sides or axes.
 *
 * Value interpretation follows CSS shorthand behavior:
 * - `[T, T]` → [top & bottom, left & right]
 * - `[T, T, T]` → [top, left & right, bottom]
 * - `[T, T, T, T]` → [top, right, bottom, left]
 *
 * @template T - The type of each spacing value (e.g., number, string, or token).
 */
export type HoneyCSSShorthandTuple<T> = [T, T] | [T, T, T] | [T, T, T, T];

/**
 * Represents a CSS layout value that can be a single value or a shorthand array of values.
 *
 * Useful for properties like `margin`, `padding`, or `borderRadius`, which allow:
 * - A single value (applied to all sides)
 * - A tuple of 2–4 values using standard CSS shorthand behavior
 *
 * Examples:
 * - `'8px'`
 * - `['8px', '12px']`
 * - `['8px', '12px', '16px', '20px']`
 *
 * @template T - The type of each individual value.
 */
export type HoneyCSSMultiValue<T> = T | HoneyCSSShorthandTuple<T>;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/steps#step-position
 */
type HoneyCSSStepFunctionPosition =
  | 'jump-start'
  | 'jump-end'
  | 'jump-none'
  | 'jump-both'
  | 'start'
  | 'end';

/**
 * Defining the allowed timing functions for the transition
 */
export type HoneyCSSTimingFunction =
  // https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
  | 'ease'
  // https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear
  | 'linear'
  | `linear(${string})`
  // https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/cubic-bezier
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'step-start'
  | 'step-end'
  // https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/steps
  | `steps(${number})`
  | `steps(${number}, ${HoneyCSSStepFunctionPosition})`;

/**
 * Represents CSS properties related to spacing and positioning.
 */
export type HoneyCSSSpacingProperty = keyof Pick<
  CSS.Properties,
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
 * Represents shorthand spacing properties that support multi-value arrays.
 *
 * These properties accept 2–4 space-separated values
 * to control spacing on multiple sides (e.g., top, right, bottom, left).
 */
export type HoneyCSSShorthandSpacingProperty = keyof Pick<
  CSS.Properties,
  'margin' | 'padding' | 'gap'
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
 * Represents a spacing value used in layout-related CSS properties.
 *
 * Can be:
 * - A single numeric value (e.g., `8`)
 * - A single dimension string (e.g., `'1rem'`)
 * - A shorthand array of 2–4 values (e.g., `[8, 12]` or `['1rem', '2rem', '1.5rem']`)
 *
 * Commonly used for properties like `margin`, `padding`, `gap`, etc.
 */
export type HoneyCSSSpacingValue = HoneyCSSMultiValue<number | HoneyCSSDimensionValue>;

/**
 * Converts a tuple of spacing values into a valid CSS shorthand string using a consistent unit.
 *
 * Acts as a type-level converter that transforms 2–4 spacing values (e.g., `[8, 12]`) into a space-separated
 * CSS string (e.g., `'8px 12px'`), suitable for shorthand-compatible properties like `margin`, `padding`, or `gap`.
 *
 * This type enforces unit consistency across all values and is useful for generating precise, typed spacing strings.
 *
 * Example outputs:
 * - `'8px 12px'` for `[8, 12]`
 * - `'1rem 2rem 1.5rem'` for `[1, 2, 1.5]`
 * - `'4px 8px 12px 16px'` for `[4, 8, 12, 16]`
 *
 * @template Tuple - A tuple of 2 to 4 values to be converted into a CSS shorthand string.
 * @template Unit - The CSS unit to apply to each value (e.g., `'px'`, `'rem'`, `'%'`).
 */
export type HoneyCSSShorthandDimensionOutput<
  Tuple extends HoneyCSSShorthandTuple<unknown>,
  Unit extends HoneyCSSDimensionUnit,
> = Tuple extends [unknown, unknown]
  ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
  : Tuple extends [unknown, unknown, unknown]
    ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
    : Tuple extends [unknown, unknown, unknown, unknown]
      ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
      : never;

/**
 * A type representing a function that returns a value for a specific CSS property based on the provided theme.
 *
 * @template CSSProperty - The CSS property this function will generate a value for.
 */
type HoneyCSSPropertyValueFn<CSSProperty extends keyof CSS.Properties> = (
  context: HoneyStyledContext<object>,
) => CSS.Properties[CSSProperty];

type HoneyRawCSSSpacingValue = number | HoneyCSSDimensionValue | CSS.Globals;

/**
 * Represents a non-responsive (raw) CSS property value for a specific CSS property.
 *
 * This type adapts based on the nature of the property:
 *
 * - For color-related properties, it accepts theme tokens or raw color values.
 * - For shorthand spacing properties (`margin`, `padding`), it supports multi-value arrays.
 * - For other spacing-related properties, it allows numeric or token-based values.
 * - For all other properties, it falls back to the standard CSS value type.
 *
 * @template CSSProperty - The name of the CSS property.
 */
type HoneyRawCSSPropertyValue<CSSProperty extends keyof CSS.Properties> =
  CSSProperty extends HoneyCSSColorProperty
    ? HoneyColor
    : CSSProperty extends HoneyCSSShorthandSpacingProperty
      ? HoneyCSSSpacingValue
      : CSSProperty extends HoneyCSSSpacingProperty
        ? HoneyRawCSSSpacingValue
        : CSS.Properties[CSSProperty];

/**
 * Represents a responsive CSS property value for a specific CSS property.
 *
 * This type maps each breakpoint name to a corresponding CSS property value.
 * The values can include:
 * - A standard CSS property value.
 * - A numeric value for dimension properties.
 * - A function returning a value based on the CSS property.
 *
 * @template CSSProperty - The key of a CSS property for which values are defined.
 */
type HoneyResponsiveCSSPropertyValue<CSSProperty extends keyof CSS.Properties> = {
  [K in HoneyBreakpointName]?:
    | HoneyRawCSSPropertyValue<CSSProperty>
    | HoneyCSSPropertyValueFn<CSSProperty>;
};

/**
 * Represents a CSS property value that can be either a single value or a responsive value.
 *
 * This type can be one of the following:
 * - A standard CSS property value.
 * - A numeric value for dimension properties.
 * - A function that generates the value based on the CSS property.
 * - A responsive value where each breakpoint maps to a specific CSS property value.
 *
 * @template CSSProperty - The key of a CSS property to check.
 */
export type HoneyCSSPropertyValue<CSSProperty extends keyof CSS.Properties> =
  | HoneyRawCSSPropertyValue<CSSProperty>
  | HoneyCSSPropertyValueFn<CSSProperty>
  | HoneyResponsiveCSSPropertyValue<CSSProperty>;

/**
 * A utility type to add a `$` prefix to a given CSS property name.
 *
 * @template CSSProperty - The string type representing a CSS property name.
 */
export type HoneyPrefixedCSSProperty<
  CSSProperty extends keyof CSS.Properties = keyof CSS.Properties,
> = `$${CSSProperty}`;

/**
 * Represents an object where each key is a prefixed CSS property (with a `$` prefix).
 *
 * Example:
 * ```
 * const styles: HoneyPrefixedCSSProperties = {
 *   $color: 'red',
 *   $fontSize: '12px'
 * };
 * ```
 */
export type HoneyPrefixedCSSProperties = {
  [CSSProperty in keyof CSS.Properties as HoneyPrefixedCSSProperty<CSSProperty>]?: HoneyCSSPropertyValue<CSSProperty>;
};

/**
 * Properties for dimension-based media queries
 */
interface HoneyCSSMediaDimensionProperties {
  width?: HoneyCSSDimensionValue;
  minWidth?: HoneyCSSDimensionValue;
  maxWidth?: HoneyCSSDimensionValue;
  height?: HoneyCSSDimensionValue;
  minHeight?: HoneyCSSDimensionValue;
  maxHeight?: HoneyCSSDimensionValue;
}

/**
 * Properties for resolution-based media queries
 */
interface HoneyCSSMediaResolutionProperties {
  resolution?: HoneyCSSResolutionValue;
  minResolution?: HoneyCSSResolutionValue;
  maxResolution?: HoneyCSSResolutionValue;
}

/**
 * Options for CSS @media at-rule.
 */
export interface HoneyCSSMediaRule
  extends HoneyCSSMediaDimensionProperties,
    HoneyCSSMediaResolutionProperties {
  operator?: 'not' | 'only';
  mediaType?: 'all' | 'print' | 'screen' | 'speech';
  orientation?: HoneyCSSMediaOrientation;
  update?: 'none' | 'slow' | 'fast';
}
