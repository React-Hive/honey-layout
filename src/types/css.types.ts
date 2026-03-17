/**
 * The types for handling CSS properties and values, focusing on dimensions, colors, media queries, and other essential CSS concepts.
 */
import * as CSS from 'csstype';
import type {
  HoneyBreakpointName,
  HoneyColor,
  HoneyCssColorProperty,
  HoneyCssShorthandSpacingProperty,
  HoneyCssSpacingProperty,
  HoneyCssSpacingValue,
  HoneyRawCssSpacingValue,
  HoneyStyledContext,
} from '@react-hive/honey-style';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/steps#step-position
 */
type HoneyCssStepFunctionPosition =
  | 'jump-start'
  | 'jump-end'
  | 'jump-none'
  | 'jump-both'
  | 'start'
  | 'end';

/**
 * Defining the allowed timing functions for the transition
 */
export type HoneyCssTimingFunction =
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
  | `steps(${number}, ${HoneyCssStepFunctionPosition})`;

/**
 * A type representing a function that returns a value for a specific CSS property based on the provided theme.
 *
 * @template CSSProperty - The CSS property this function will generate a value for.
 */
type HoneyCssPropertyValueFn<CSSProperty extends keyof CSS.Properties> = (
  context: HoneyStyledContext<object>,
) => CSS.Properties[CSSProperty];

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
type HoneyRawCssPropertyValue<CSSProperty extends keyof CSS.Properties> =
  CSSProperty extends HoneyCssColorProperty
    ? HoneyColor
    : CSSProperty extends HoneyCssShorthandSpacingProperty
      ? HoneyCssSpacingValue
      : CSSProperty extends HoneyCssSpacingProperty
        ? HoneyRawCssSpacingValue
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
type HoneyResponsiveCssPropertyValue<CSSProperty extends keyof CSS.Properties> = {
  [K in HoneyBreakpointName]?:
    | HoneyRawCssPropertyValue<CSSProperty>
    | HoneyCssPropertyValueFn<CSSProperty>;
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
export type HoneyCssPropertyValue<CSSProperty extends keyof CSS.Properties> =
  | HoneyRawCssPropertyValue<CSSProperty>
  | HoneyCssPropertyValueFn<CSSProperty>
  | HoneyResponsiveCssPropertyValue<CSSProperty>;

/**
 * A utility type to add a `$` prefix to a given CSS property name.
 *
 * @template CSSProperty - The string type representing a CSS property name.
 */
export type Honey$PrefixedCssProperty<
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
export type Honey$PrefixedCssProperties = {
  [CSSProperty in keyof CSS.Properties as Honey$PrefixedCssProperty<CSSProperty>]?: HoneyCssPropertyValue<CSSProperty>;
};
