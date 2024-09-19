import type { HTMLAttributes } from 'react';
import type { DefaultTheme, ExecutionContext, StyleFunction } from 'styled-components';
import { css } from 'styled-components';
import * as CSS from 'csstype';

import type {
  Nullable,
  HoneyBreakpointName,
  HoneyCSSArrayValue,
  HoneyCSSDimensionShortHandValue,
  HoneyCSSDimensionUnit,
  HoneyCSSMultiValue,
  HoneyCSSPropertyValue,
  HoneyCSSMediaRule,
  HoneySpacings,
  HoneyColorKey,
  BaseHoneyColors,
  HoneyFontName,
  HoneyCSSColor,
  HoneyDimensionName,
  HoneyPrefixedCSSProperties,
  HoneyCSSDimensionProperty,
  HoneyCSSColorProperty,
  HoneyBreakpoints,
  HoneyScreenState,
  HoneyCSSDimensionValue,
  HoneyPrefixedCSSProperty,
} from './types';
import { camelToDashCase, convertHexToHexWithAlpha, media, pxToRem } from './utils';
import { CSS_COLOR_PROPERTIES, CSS_DIMENSION_PROPERTIES } from './constants';

/**
 * Conditional type to determine the return type of the `resolveSpacing` function.
 *
 * @template MultiValue - Type of the spacing value can be a single value or an array of values.
 * @template Unit - CSS length unit, which can be null or a specific unit type.
 */
export type ResolveSpacingResult<
  MultiValue extends HoneyCSSMultiValue<number>,
  Unit extends Nullable<HoneyCSSDimensionUnit>,
> = Unit extends null
  ? MultiValue extends HoneyCSSArrayValue<number>
    ? // Returns an array of calculated values if `MultiValue` is an array
      HoneyCSSArrayValue<number>
    : // Returns a single calculated value if `MultiValue` is a single number
      number
  : MultiValue extends HoneyCSSArrayValue<number>
    ? // Returns a shorthand CSS value for arrays with specified unit
      HoneyCSSDimensionShortHandValue<MultiValue, NonNullable<Unit>>
    : // Returns a single value with specified unit
      `${number}${Unit}`;

/**
 * Resolves a spacing value or multiple spacing values based on the provided input, CSS unit, and spacing type.
 * This function calculates the appropriate spacing values from a theme and formats them with the specified CSS unit.
 *
 * @template MultiValue - Represents the spacing value(s), which could be a single number or an array of numbers (e.g., [1, 2, 3, 4]).
 * @template Unit - The CSS unit used for the resolved spacing value, e.g., 'px', 'em'. Defaults to 'px'.
 *
 * @param {MultiValue} value - The spacing factor(s) to be applied. It can be:
 * - A single number representing a multiplier for the base spacing value.
 * - An array of numbers representing multiple multipliers for base spacing values (e.g., for margins or padding).
 * @param {Unit} [unit='px'] - The CSS unit to use for the calculated value. If `null` or `undefined`, no unit is applied.
 * Defaults to 'px'.
 * @param {keyof HoneySpacings} [type='base'] - The type of spacing to use from the theme. Determines which base spacing
 * value to use for calculations (e.g., 'base', 'small', 'large'). Defaults to 'base'.
 *
 * @returns {(props: ExecutionContext) => ResolveSpacingResult<MultiValue, Unit>} - A function that takes `ExecutionContext`
 * (containing the theme object) and returns the resolved spacing value(s). The result is either:
 * - A single calculated value (e.g., '16px') if the input is a single number.
 * - A string of space-separated values (e.g., '8px 16px 24px 32px') if the input is an array of numbers.
 */
export const resolveSpacing =
  <
    MultiValue extends HoneyCSSMultiValue<number>,
    Unit extends Nullable<HoneyCSSDimensionUnit> = 'px',
  >(
    value: MultiValue,
    unit: Unit = 'px' as Unit,
    type: keyof HoneySpacings = 'base',
  ): ((props: ExecutionContext) => ResolveSpacingResult<MultiValue, Unit>) =>
  ({ theme }: ExecutionContext): ResolveSpacingResult<MultiValue, Unit> => {
    const selectedSpacing = theme.spacings[type] ?? 0;

    if (typeof value === 'number') {
      const calculatedValue = value * selectedSpacing;

      return (unit ? `${calculatedValue}${unit}` : calculatedValue) as ResolveSpacingResult<
        MultiValue,
        Unit
      >;
    }

    const calculatedValues = value.map(v => {
      const calculatedValue = v * selectedSpacing;

      return unit ? `${calculatedValue}${unit}` : calculatedValue;
    });

    return calculatedValues.join(' ') as ResolveSpacingResult<MultiValue, Unit>;
  };

/**
 * Resolves a color value based on the provided color key and optional alpha value.
 *
 * @param colorKey - The key representing the color to be resolved. This key is a string in the format 'colorType.colorName'.
 * @param alpha - Optional. The alpha transparency value between 0 (fully transparent) and 1 (fully opaque).
 *
 * @returns The resolved color value from the theme, either in HEX format or in 8-character HEX with alpha format.
 *
 * @throws Will throw an error if the provided alpha value is not within the valid range (0 to 1).
 * @throws Will throw an error if the color format is invalid.
 */
export const resolveColor =
  (colorKey: HoneyColorKey, alpha?: number) =>
  ({ theme }: ExecutionContext): HoneyCSSColor => {
    const [colorType, colorName] = colorKey.split('.');

    const color = theme.colors[colorType as keyof BaseHoneyColors][colorName];

    return alpha !== undefined ? convertHexToHexWithAlpha(color, alpha) : color;
  };

/**
 * Resolves the font styles based on the provided font name from the theme.
 *
 * @param {HoneyFontName} fontName - The name of the font to be resolved from the theme.
 *
 * @returns A style function that takes a theme object and returns the CSS styles for the specified font.
 */
export const resolveFont =
  (fontName: HoneyFontName) =>
  ({ theme }: ExecutionContext) => {
    const font = theme.fonts[fontName];

    return css`
      font-family: ${font.family};
      font-size: ${pxToRem(font.size)};
      font-weight: ${font.weight};
      line-height: ${font.lineHeight !== undefined && pxToRem(font.lineHeight)};
      letter-spacing: ${font.letterSpacing !== undefined && pxToRem(font.letterSpacing)};
    `;
  };

/**
 * Resolves a specific dimension value from the theme configuration.
 *
 * @param {HoneyDimensionName} dimensionName - The name of the dimension to resolve.
 *
 * @returns A style function that takes the theme and returns the resolved dimension value from the theme.
 */
export const resolveDimension =
  (dimensionName: HoneyDimensionName) =>
  ({ theme }: ExecutionContext): HoneyCSSDimensionValue =>
    theme.dimensions[dimensionName];

/**
 * Type guard function to check if a property name is a dimension property.
 *
 * @param {keyof CSS.Properties} propertyName - The name of the CSS property.
 *
 * @returns {propertyName is HoneyCSSDimensionProperty} - True if the property name is a dimension property, false otherwise.
 */
const checkIsCSSDimensionProperty = (
  propertyName: keyof CSS.Properties,
): propertyName is HoneyCSSDimensionProperty => {
  return (CSS_DIMENSION_PROPERTIES as readonly string[]).includes(propertyName as string);
};

/**
 * Type guard function to check if a property name is a color property.
 *
 * @param {keyof CSS.Properties} propertyName - The name of the CSS property.
 *
 * @returns {propertyName is HoneyCSSColorProperty} - True if the property name is a color property, false otherwise.
 */
const checkIsCSSColorProperty = (
  propertyName: keyof CSS.Properties,
): propertyName is HoneyCSSColorProperty => {
  return (CSS_COLOR_PROPERTIES as readonly string[]).includes(propertyName as string);
};

/**
 * Type guard function to check if a string value follows the pattern of a theme color value.
 *
 * A theme color value is assumed to be a string containing exactly one dot (e.g., 'primary.main').
 *
 * @param {string} propertyValue - The string value to check.
 *
 * @returns {value is HoneyColorKey} - True if the string value is a theme color value, false otherwise.
 */
const checkIsThemeColorValue = (propertyValue: string): propertyValue is HoneyColorKey =>
  propertyValue.split('.').length === 2;

/**
 * Retrieves the CSS property value for a specific breakpoint, potentially resolving it to include units.
 *
 * This function handles different types of property values:
 * - If `propertyValue` is an object (indicating a responsive value), it extracts the value corresponding to the specified `breakpoint`.
 * - If the property is related to dimensions or spacing (e.g., `width`, `margin`), it uses the `resolveSpacing` function to calculate and format the value with the appropriate unit (e.g., 'px').
 *
 * Note:
 * The `resolveSpacing` function returns a function that requires the `theme` object to perform the resolution, which needs to be provided in the context where `getCSSPropertyValue` is used.
 *
 * @param {CSSProperty} propertyName - The name of the CSS property to retrieve. Must be a key of `CSS.Properties`.
 * @param {HoneyCSSPropertyValue<CSSProperty>} propertyValue - The value associated with the CSS property, which can be a direct value, a responsive object, or a function.
 * @param {HoneyBreakpointName} breakpoint - The name of the breakpoint used to extract the value from a responsive object, if applicable.
 *
 * @returns The resolved CSS property value. This could be:
 *   - A direct value (if `propertyValue` was not an object or the property is not related to dimensions).
 *   - A value formatted with units (if the property is related to dimensions or spacing and `resolveSpacing` was applied).
 */
const getCSSPropertyValue = <CSSProperty extends keyof CSS.Properties>(
  propertyName: CSSProperty,
  propertyValue: HoneyCSSPropertyValue<CSSProperty>,
  breakpoint: HoneyBreakpointName,
) => {
  // Determine the actual value to use based on the breakpoint
  const resolvedValue =
    typeof propertyValue === 'object' && !Array.isArray(propertyValue)
      ? propertyValue[breakpoint]
      : propertyValue;

  if (resolvedValue === undefined) {
    return undefined;
  }

  if (checkIsCSSDimensionProperty(propertyName)) {
    if (typeof resolvedValue === 'number' || Array.isArray(resolvedValue)) {
      return resolveSpacing(resolvedValue, 'px');
    }
  }

  if (checkIsCSSColorProperty(propertyName)) {
    if (typeof resolvedValue === 'string' && checkIsThemeColorValue(resolvedValue)) {
      return resolveColor(resolvedValue);
    }
  }

  return resolvedValue;
};

/**
 * Determines if a given HTML attribute is a CSS property that is prefixed with a '$'.
 * This convention is typically used for applying dynamic or responsive styles.
 *
 * @param {string} attribute - The HTML attribute or key to check.
 *
 * @returns {attribute is HoneyPrefixedCSSProperty} - Returns true if the attribute is a valid prefixed CSS property, otherwise false.
 */
const isCSSPrefixedProperty = (attribute: string): attribute is HoneyPrefixedCSSProperty =>
  attribute[0] === '$';

/**
 * Filters and matches CSS properties from the provided props object based on the specified breakpoint.
 *
 * @template Props - The type representing the HTML attributes and Honey-prefixed CSS properties.
 *
 * @param {Props} props - The props object containing CSS properties and other HTML attributes.
 * @param {HoneyBreakpointName} breakpoint - The name of the breakpoint for filtering CSS properties.
 *
 * @returns {Array<[HoneyPrefixedCSSProperty, CSS.Properties[keyof CSS.Properties]]>}
 *   An array of tuples where each tuple contains a Honey-prefixed CSS property and its value.
 */
const matchCSSProperties = <Props extends HTMLAttributes<HTMLElement> & HoneyPrefixedCSSProperties>(
  props: Props,
  breakpoint: HoneyBreakpointName,
): [HoneyPrefixedCSSProperty, CSS.Properties[keyof CSS.Properties]][] =>
  Object.entries(props).filter(
    ([attribute, attributeValue]) =>
      (isCSSPrefixedProperty(attribute) && breakpoint === 'xs') ||
      (attributeValue && typeof attributeValue === 'object' && breakpoint in attributeValue),
  ) as [HoneyPrefixedCSSProperty, CSS.Properties[keyof CSS.Properties]][];

/**
 * Generates CSS styles based on the provided breakpoint and properties.
 * Filters the properties to include only those that match the specified breakpoint.
 * Converts the property names from camelCase to dash-case and retrieves their values.
 *
 * @template Props - The type representing HTML attributes and Honey-prefixed CSS properties.
 *
 * @param {HoneyBreakpointName} breakpoint - The name of the breakpoint to filter properties by.
 *
 * @returns {(context: ExecutionContext & Props) => ReturnType<typeof css>} -
 *   A function that takes an execution context and properties, and returns a CSS block
 *   with styles generated for the specified breakpoint.
 */
export const createStyles =
  <Props extends HTMLAttributes<HTMLElement> & HoneyPrefixedCSSProperties>(
    breakpoint: HoneyBreakpointName,
  ): ((context: ExecutionContext & Props) => ReturnType<typeof css>) =>
  ({ theme, ...props }: ExecutionContext & Props) => css`
    ${matchCSSProperties(props, breakpoint).map(([prefixedPropertyName, propertyValue]) => {
      const propertyName = prefixedPropertyName.slice(1) as keyof CSS.Properties;

      return css`
        ${camelToDashCase(propertyName)}: ${getCSSPropertyValue(
          propertyName,
          propertyValue,
          breakpoint,
        )};
      `;
    })}
  `;

/**
 * Determines if any of the given properties include styles that require a media query
 * for the specified breakpoint. This function checks if there are any properties in `props`
 * that are prefixed with `$` and have responsive values that include the given breakpoint.
 *
 * @param {HoneyBreakpointName} breakpoint - The name of the breakpoint to check within responsive values.
 * @param {HTMLAttributes<HTMLElement> & HoneyPrefixedCSSProperties} props - The properties object that may contain responsive styles.
 *
 * @returns {boolean} - Returns true if at least one property in `props` has styles for the specified breakpoint; otherwise, false.
 */
const hasBreakpointStyles = (
  breakpoint: HoneyBreakpointName,
  props: HTMLAttributes<HTMLElement> & HoneyPrefixedCSSProperties,
): boolean =>
  Object.entries(props).some(
    ([attribute, attributeValue]) =>
      isCSSPrefixedProperty(attribute) &&
      typeof attributeValue === 'object' &&
      breakpoint in attributeValue,
  );

/**
 * Utility function that returns functions for generating media queries for the specified breakpoint.
 * The down function creates a media query for screen sizes smaller than the breakpoint,
 * while the up function creates a media query for screen sizes larger than the breakpoint.
 *
 * @param {HoneyBreakpointName} breakpoint - The name of the breakpoint.
 * @param {HoneyCSSMediaRule} [ruleOptions={}] - Additional options for the media rule.
 *
 * @returns Styled functions for generating media queries.
 */
export const bpMedia = (
  breakpoint: HoneyBreakpointName,
  ruleOptions: Omit<HoneyCSSMediaRule, 'width' | 'minWidth' | 'maxWidth'> = {},
) => {
  const resolveBpValue = (theme: DefaultTheme) => {
    const value = theme.breakpoints[breakpoint];
    if (!value) {
      throw new Error(`[honey-layout]: Setup for breakpoint "${breakpoint}" was not found.`);
    }

    return value;
  };

  const down: StyleFunction<object> = ({ theme }) =>
    media([
      {
        maxWidth: `${resolveBpValue(theme)}px`,
        ...ruleOptions,
      },
    ]);

  const up: StyleFunction<object> = ({ theme }) =>
    media([
      {
        minWidth: `${resolveBpValue(theme)}px`,
        ...ruleOptions,
      },
    ]);

  return {
    down,
    up,
  };
};

/**
 * Applies CSS styles wrapped in a media query for the specified breakpoint based on the provided properties.
 * If no styles are found for the specified breakpoint or if the breakpoint configuration is missing,
 * it returns `null`. Otherwise, it generates media query styles using the `createStyles` function.
 *
 * @template Props - The type representing HTML attributes and Honey-prefixed CSS properties.
 *
 * @param {HoneyBreakpointName} breakpoint - The name of the breakpoint to apply media query styles for.
 *
 * @returns {(context: ExecutionContext & Props) => Nullable<ReturnType<typeof css>>} - A function that takes context and properties
 *   and returns a CSS block wrapped in a media query if styles exist for the specified breakpoint; otherwise, returns `null`.
 */
export const applyBreakpointStyles =
  <Props extends HTMLAttributes<HTMLElement> & HoneyPrefixedCSSProperties>(
    breakpoint: HoneyBreakpointName,
  ): ((context: ExecutionContext & Props) => Nullable<ReturnType<typeof css>>) =>
  ({ theme, ...props }: ExecutionContext & Props) => {
    const breakpointConfig = theme.breakpoints[breakpoint];

    if (!breakpointConfig || !hasBreakpointStyles(breakpoint, props)) {
      return null;
    }

    return css`
      ${bpMedia(breakpoint).up} {
        ${createStyles(breakpoint)};
      }
    `;
  };

/**
 * Resolves the current screen state based on the window's dimensions and the breakpoints provided in the theme.
 *
 * This function evaluates the current orientation (portrait or landscape) by checking the screen's orientation type.
 * It then compares the window's width against the theme-defined breakpoints to determine the active breakpoint
 * (e.g., xs, sm, md, lg, xl). If no breakpoints are provided, it returns a default state with all breakpoints set to false.
 *
 * @param breakpoints - A partial mapping of breakpoints defined in the theme. These breakpoints represent the minimum
 *                      width required for each screen size category (e.g., xs, sm, md, lg, xl).
 *
 * @returns An object representing the screen state, including:
 *  - `isPortrait`: Whether the screen is in portrait mode.
 *  - `isLandscape`: Whether the screen is in landscape mode.
 *  - `isXs`: Whether the screen width is less than the 'xs' breakpoint.
 *  - `isSm`: Whether the screen width is less than the 'sm' breakpoint.
 *  - `isMd`: Whether the screen width is less than the 'md' breakpoint.
 *  - `isLg`: Whether the screen width is less than the 'lg' breakpoint.
 *  - `isXl`: Whether the screen width is less than the 'xl' breakpoint.
 */
export const resolveScreenState = (
  breakpoints: Partial<HoneyBreakpoints> | undefined,
): HoneyScreenState => {
  const orientationType = window.screen.orientation.type;

  const isPortrait =
    orientationType === 'portrait-primary' || orientationType === 'portrait-secondary';

  const isLandscape = !isPortrait;

  if (!breakpoints) {
    return {
      isPortrait,
      isLandscape,
      isXs: false,
      isSm: false,
      isMd: false,
      isLg: false,
      isXl: false,
    };
  }

  const sortedBreakpoints = Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b) // Sort breakpoints in ascending order of width
    .map(([name]) => name) as (keyof Partial<HoneyBreakpoints>)[];

  const currentBreakpoint =
    sortedBreakpoints.find(breakpoint => {
      const screenSize = breakpoints[breakpoint];

      return screenSize ? window.innerWidth < screenSize : false;
    }) ?? sortedBreakpoints.pop(); // Use the largest breakpoint if no match is found

  return {
    isPortrait,
    isLandscape,
    isXs: currentBreakpoint === 'xs',
    isSm: currentBreakpoint === 'sm',
    isMd: currentBreakpoint === 'md',
    isLg: currentBreakpoint === 'lg',
    isXl: currentBreakpoint === 'xl',
  };
};
