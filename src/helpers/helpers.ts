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
  HoneyColors,
} from '../types';
import { camelToDashCase, convertHexToHexWithAlpha, media, pxToRem } from '../utils';
import { CSS_COLOR_PROPERTIES, CSS_DIMENSION_PROPERTIES } from '../constants';

export const noop = () => {};

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const generateUniqueId = () => {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `${timestamp}${randomNum}`;
};

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
 * @param value - The spacing factor(s) to be applied. It can be:
 *                - A single number representing a multiplier for the base spacing value.
 *                - An array of numbers representing multiple multipliers for base spacing values (e.g., for margins or padding).
 * @param [unit='px'] - The CSS unit to use for the calculated value. If `null` or `undefined`, no unit is applied.
 *                      Defaults to 'px'.
 * @param [type='base'] - The type of spacing to use from the theme. Determines which base spacing
 *                        value to use for calculations (e.g., 'base', 'small', 'large'). Defaults to 'base'.
 *
 * @returns A function that takes `ExecutionContext` (containing the theme object) and returns the resolved spacing value(s).
 *          The result is either:
 *            - A single calculated value (e.g., '16px') if the input is a single number.
 *            - A string of space-separated values (e.g., '8px 16px 24px 32px') if the input is an array of numbers.
 */
export const resolveSpacing =
  <
    MultiValue extends HoneyCSSMultiValue<number>,
    Unit extends Nullable<HoneyCSSDimensionUnit> = 'px',
  >(
    value: MultiValue,
    unit: Unit = 'px' as Unit,
    type: keyof HoneySpacings = 'base',
  ): ((context: ExecutionContext) => ResolveSpacingResult<MultiValue, Unit>) =>
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
 * Resolves a color value from the theme or returns the input color directly if it's a standalone color name or HEX value.
 *
 * @param colorKey - A string representing the color to resolve.
 *                 This can be:
 *                  - A theme key in the format 'colorType.colorName'.
 *                  - A standalone color name (e.g., "red", "blue").
 *                  - A HEX color value (e.g., "#RRGGBB").
 * @param [alpha] - The alpha transparency value between 0 (fully transparent) and 1 (fully opaque).
 *                  Default to `undefined`.
 *
 * @returns A function that takes an `ExecutionContext` with a `theme` and resolves the color value:
 *           - A HEX color string from the theme (e.g., "#RRGGBB").
 *           - A HEX color string with alpha (e.g., "#RRGGBBAA") if `alpha` is provided.
 *           - The input `colorKey` value directly if it's a standalone color name or HEX value.
 *
 * @throws Will throw an error if the provided alpha value is not within the valid range (0 to 1).
 * @throws Will throw an error if the color format is invalid.
 */
export const resolveColor =
  (colorKey: HoneyColorKey | HoneyCSSColor, alpha?: number) =>
  ({ theme }: ExecutionContext): HoneyCSSColor => {
    const [colorType, colorName] = colorKey.split('.');

    const color = colorName
      ? theme.colors[colorType as keyof HoneyColors][colorName]
      : (colorType as HoneyCSSColor);

    return alpha === undefined ? color : convertHexToHexWithAlpha(color, alpha);
  };

/**
 * Resolves the font styles based on the provided font name from the theme.
 *
 * @param fontName - The name of the font to be resolved from the theme.
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
 * @param dimensionName - The name of the dimension to resolve.
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
 * @param propertyName - The name of the CSS property.
 *
 * @returns True if the property name is a dimension property, false otherwise.
 */
const isCSSDimensionProperty = (
  propertyName: keyof CSS.Properties,
): propertyName is HoneyCSSDimensionProperty =>
  (CSS_DIMENSION_PROPERTIES as string[]).includes(propertyName as string);

/**
 * Type guard function to check if a property name is a color property.
 *
 * @param propertyName - The name of the CSS property.
 *
 * @returns True if the property name is a color property, false otherwise.
 */
const isCSSColorProperty = (
  propertyName: keyof CSS.Properties,
): propertyName is HoneyCSSColorProperty =>
  (CSS_COLOR_PROPERTIES as string[]).includes(propertyName as string);

/**
 * Determines if a given HTML property is a CSS property that is prefixed with a '$'.
 * This convention is typically used for applying dynamic or responsive styles.
 *
 * @param propertyName - The HTML property or key to check.
 *
 * @returns Returns true if the property is a valid prefixed CSS property, otherwise false.
 */
const isCSSPrefixedProperty = (propertyName: string): propertyName is HoneyPrefixedCSSProperty =>
  propertyName[0] === '$';

/**
 * Type guard function to check if a string value follows the pattern of a theme color value.
 *
 * A theme color value is assumed to be a string containing exactly one dot (e.g., 'primary.main').
 *
 * @param propertyValue - The string value to check.
 *
 * @returns True if the string value is a theme color value, false otherwise.
 */
const isThemeColorValue = (propertyValue: string): propertyValue is HoneyColorKey =>
  propertyValue.split('.').length === 2;

/**
 * Retrieves the CSS property value for a specific breakpoint, potentially resolving it to include units.
 *
 * This function handles different types of property values:
 * - If `propertyValue` is an object (indicating a responsive value), it extracts the value corresponding to the specified `breakpoint`.
 * - If the property is related to dimensions or spacing (e.g., `width`, `margin`),
 *   it uses the `resolveSpacing` function to calculate and format the value with the appropriate unit (e.g., 'px').
 *
 * @remarks
 * The `resolveSpacing` function returns a function that requires the `theme` object to perform the resolution,
 * which needs to be provided in the context where `getCSSPropertyValue` is used.
 *
 * @param propertyName - The name of the CSS property to retrieve. Must be a key of `CSS.Properties`.
 * @param propertyValue - The value associated with the CSS property, which can be a direct value, a responsive object, or a function.
 * @param breakpoint - The name of the breakpoint used to extract the value from a responsive object, if applicable.
 *
 * @returns The resolved CSS property value. This could be:
 *           - A direct value (if `propertyValue` was not an object or the property is not related to dimensions).
 *           - A value formatted with units (if the property is related to dimensions or spacing and `resolveSpacing` was applied).
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

  if (isCSSDimensionProperty(propertyName)) {
    if (typeof resolvedValue === 'number' || Array.isArray(resolvedValue)) {
      return resolveSpacing(resolvedValue, 'px');
    }
  }

  if (isCSSColorProperty(propertyName)) {
    if (typeof resolvedValue === 'string' && isThemeColorValue(resolvedValue)) {
      return resolveColor(resolvedValue);
    }
  }

  return resolvedValue;
};

/**
 * Filters and matches CSS properties from the provided props object based on the specified breakpoint.
 *
 * @template Props - The type representing the HTML attributes and Honey-prefixed CSS properties.
 *
 * @param props - The object containing CSS properties and other HTML attributes.
 * @param breakpoint - The name of the breakpoint for filtering CSS properties.
 *
 * @returns An array of tuples where each tuple contains a Honey-prefixed CSS property and its value.
 */
const matchCSSProperties = <Props extends HTMLAttributes<HTMLElement> & HoneyPrefixedCSSProperties>(
  props: Props,
  breakpoint: HoneyBreakpointName,
): [HoneyPrefixedCSSProperty, CSS.Properties[keyof CSS.Properties]][] =>
  Object.entries(props).filter(
    ([propertyName, propertyValue]) =>
      (isCSSPrefixedProperty(propertyName) && breakpoint === 'xs') ||
      (propertyValue && typeof propertyValue === 'object' && breakpoint in propertyValue),
  ) as [HoneyPrefixedCSSProperty, CSS.Properties[keyof CSS.Properties]][];

/**
 * Generates CSS styles based on the provided breakpoint and properties.
 * Filters the properties to include only those that match the specified breakpoint.
 * Converts the property names from camelCase to dash-case and retrieves their values.
 *
 * @template Props - The type representing HTML attributes and Honey-prefixed CSS properties.
 *
 * @param breakpoint - The name of the breakpoint to filter properties by.
 *
 * @returns A function that takes an execution context and properties, and returns a CSS block
 *          with styles generated for the specified breakpoint.
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
 * @param breakpoint - The name of the breakpoint to check within responsive values.
 * @param props - The object that may contain responsive styles.
 *
 * @returns Returns true if at least one property in `props` has styles for the specified breakpoint; otherwise, false.
 */
const hasBreakpointStyles = (
  breakpoint: HoneyBreakpointName,
  props: HTMLAttributes<HTMLElement> & HoneyPrefixedCSSProperties,
): boolean =>
  Object.entries(props).some(
    ([propertyName, propertyValue]) =>
      isCSSPrefixedProperty(propertyName) &&
      typeof propertyValue === 'object' &&
      breakpoint in propertyValue,
  );

/**
 * Utility function that returns functions for generating media queries for the specified breakpoint.
 * The down function creates a media query for screen sizes smaller than the breakpoint,
 * while the up function creates a media query for screen sizes larger than the breakpoint.
 *
 * @param breakpoint - The name of the breakpoint.
 * @param [ruleOptions={}] - Additional options for the media rule.
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
 * @param breakpoint - The name of the breakpoint to apply media query styles for.
 *
 * @returns A function that takes context and properties and returns a CSS block wrapped in a media query
 *          if styles exist for the specified breakpoint; otherwise, returns `null`.
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
