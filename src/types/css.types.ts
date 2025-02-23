/**
 * The types for handling CSS properties and values, focusing on dimensions, colors, media queries, and other essential CSS concepts.
 */
import type { ExecutionContext } from 'styled-components';
import * as CSS from 'csstype';

import type { HoneyBreakpointName, HoneyColorKey } from './types';

export type HoneyCSSResolutionUnit = 'dpi' | 'dpcm' | 'dppx' | 'x';

export type HoneyCSSResolutionValue = `${number}${HoneyCSSResolutionUnit}`;

export type HoneyCSSMediaOrientation = 'landscape' | 'portrait';

type HoneyCSSAbsoluteDimensionUnit = 'px' | 'cm' | 'mm' | 'in' | 'pt' | 'pc';
type HoneyCSSRelativeDimensionUnit = 'em' | 'rem' | '%' | 'vh' | 'vw' | 'vmin' | 'vmax';

export type HoneyHEXColor = `#${string}`;

export type HoneyCSSColor = CSS.DataType.NamedColor | HoneyHEXColor;

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

// https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/steps#step-position
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
 * A type representing a function that returns a value for a specific CSS property based on the provided theme.
 *
 * @template CSSProperty - The CSS property this function will generate a value for.
 */
type HoneyCSSPropertyValueFn<CSSProperty extends keyof CSS.Properties> = (
  context: ExecutionContext,
) => CSS.Properties[CSSProperty];

/**
 * Type representing possible values for CSS color properties.
 *
 * This type can be either a color from the theme or a valid CSS color value.
 *
 * @template CSSProperty - The key of a CSS property to check.
 */
type HoneyCSSColorValue<CSSProperty extends keyof CSS.Properties> =
  CSSProperty extends HoneyCSSColorProperty
    ? HoneyCSSColor | HoneyColorKey
    : CSS.Properties[CSSProperty] | HoneyCSSDimensionNumericValue<CSSProperty>;

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
type HoneyResponsiveCSSPropertyValue<CSSProperty extends keyof CSS.Properties> = Partial<
  Record<
    HoneyBreakpointName,
    HoneyCSSColorValue<CSSProperty> | HoneyCSSPropertyValueFn<CSSProperty>
  >
>;

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
  | HoneyCSSColorValue<CSSProperty>
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
 * Represents an object where each key is a prefixed CSS property (with a `$` prefix),
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
