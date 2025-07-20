import * as CSS from 'csstype';
import { CSS_COLOR_PROPERTIES, CSS_SPACING_PROPERTIES } from '@react-hive/honey-style';
import { assert, camelToDashCase } from '@react-hive/honey-utils';
import {
  css,
  checkIsThemeColorValue,
  resolveColor,
  mediaQuery,
  resolveSpacing,
} from '@react-hive/honey-style';
import type { HTMLAttributes } from 'react';
import type {
  FastOmit,
  HoneyTheme,
  HoneyStyledFunction,
  HoneyBreakpointName,
  HoneyBreakpoints,
  HoneyMediaQueryRule,
  HoneyCSSSpacingProperty,
  HoneyCSSColorProperty,
} from '@react-hive/honey-style';

import type {
  HoneyScreenState,
  HoneyCSSPropertyValue,
  Honey$PrefixedCSSProperty,
  Honey$PrefixedCSSProperties,
} from '../types';

export const generateUniqueId = () => {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `${timestamp}${randomNum}`;
};

/**
 * Type guard function that checks whether a given CSS property name
 * is classified as a spacing-related property.
 *
 * Spacing properties include margin, padding, positional offsets,
 * and layout gaps (e.g., `gap`, `top`, `marginLeft`, etc.).
 *
 * @param propertyName - The name of the CSS property to check.
 *
 * @returns `true` if the property is a spacing property, otherwise `false`.
 */
const checkIsSpacingCSSProperty = (
  propertyName: keyof CSS.Properties,
): propertyName is HoneyCSSSpacingProperty =>
  (CSS_SPACING_PROPERTIES as string[]).includes(propertyName as string);

/**
 * Type guard function to check if a property name is a color property.
 *
 * @param propertyName - The name of the CSS property.
 *
 * @returns True if the property name is a color property, false otherwise.
 */
const checkIsColorCSSProperty = (
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
const checkIs$PrefixedCSSProperty = (
  propertyName: string,
): propertyName is Honey$PrefixedCSSProperty => propertyName[0] === '$';

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

  if (checkIsSpacingCSSProperty(propertyName)) {
    if (typeof resolvedValue === 'number' || Array.isArray(resolvedValue)) {
      return resolveSpacing(resolvedValue, 'px');
    }
  } else if (checkIsColorCSSProperty(propertyName)) {
    if (typeof resolvedValue === 'string' && checkIsThemeColorValue(resolvedValue)) {
      return resolveColor(resolvedValue);
    }
  }

  return resolvedValue;
};

export type HoneyStyledBoxProps = HTMLAttributes<HTMLElement> & Honey$PrefixedCSSProperties;

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
const matchCSSProperties = <Props extends HoneyStyledBoxProps>(
  props: Props,
  breakpoint: HoneyBreakpointName,
) =>
  Object.entries(props).filter(
    ([propertyName, propertyValue]) =>
      (checkIs$PrefixedCSSProperty(propertyName) && breakpoint === 'xs') ||
      (propertyValue && typeof propertyValue === 'object' && breakpoint in propertyValue),
  ) as [Honey$PrefixedCSSProperty, CSS.Properties[keyof CSS.Properties]][];

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
  (breakpoint: HoneyBreakpointName): HoneyStyledFunction<HoneyStyledBoxProps> =>
  ({ theme, ...props }) => css`
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
  props: HoneyStyledBoxProps,
): boolean =>
  Object.entries(props).some(
    ([propertyName, propertyValue]) =>
      checkIs$PrefixedCSSProperty(propertyName) &&
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
  ruleOptions: FastOmit<HoneyMediaQueryRule, 'width' | 'minWidth' | 'maxWidth'> = {},
) => {
  const resolveBpValue = (theme: HoneyTheme) => {
    const value = theme.breakpoints[breakpoint];
    assert(value, `[honey-layout]: Setup for breakpoint "${breakpoint}" was not found.`);

    return value;
  };

  const down: HoneyStyledFunction<object> = ({ theme }) =>
    mediaQuery([
      {
        maxWidth: `${resolveBpValue(theme)}px`,
        ...ruleOptions,
      },
    ]);

  const up: HoneyStyledFunction<object> = ({ theme }) =>
    mediaQuery([
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
  (breakpoint: HoneyBreakpointName): HoneyStyledFunction<HoneyStyledBoxProps> =>
  ({ theme, ...props }) => {
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
