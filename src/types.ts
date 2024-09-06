import * as CSS from 'csstype';

import type { ComponentType, ReactNode } from 'react';
import type { DefaultTheme, Interpolation } from 'styled-components';
import type { DataType } from 'csstype';

export type TimeoutId = ReturnType<typeof setTimeout>;

export type Nullable<T> = T | null;

type ExtractKeys<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? K : never;
}[keyof T];

type ExcludeKeys<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? never : K;
}[keyof T];

export type KeysWithStringValues<T> = Extract<ExtractKeys<T, string | null | undefined>, string>;

export type KeysWithArrayValues<T> = Extract<ExtractKeys<T, unknown[] | null | undefined>, string>;

export type KeysWithNonArrayValues<T> = Extract<
  ExcludeKeys<T, unknown[] | null | undefined>,
  string
>;

export type HoneyHEXColor = `#${string}`;

type HoneyCSSAbsoluteDimensionUnit = 'px' | 'cm' | 'mm' | 'in' | 'pt' | 'pc';
type HoneyCSSRelativeDimensionUnit = 'em' | 'rem' | '%' | 'vh' | 'vw' | 'vmin' | 'vmax';

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
 * Represents a CSS dimension unit, which can be either an absolute or relative.
 */
export type HoneyCSSDimensionUnit = HoneyCSSAbsoluteDimensionUnit | HoneyCSSRelativeDimensionUnit;

export type HoneyCSSResolutionUnit = 'dpi' | 'dpcm' | 'dppx' | 'x';

export type HoneyCSSResolutionValue = `${number}${HoneyCSSResolutionUnit}`;

export type HoneyCSSMediaOrientation = 'landscape' | 'portrait';

export type HoneyCSSColor = DataType.NamedColor | HoneyHEXColor;

/**
 * Represents a specific CSS dimension value with a unit.
 */
export type HoneyCSSDimensionValue<Unit extends HoneyCSSDimensionUnit = HoneyCSSDimensionUnit> =
  `${number}${Unit}`;

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

/**
 * Represents the breakpoints configuration in pixes for a responsive layout.
 *
 * Notes:
 * - `xs`: Extra small devices
 * - `sm`: Small devices
 * - `md`: Medium devices
 * - `lg`: Large devices
 * - `xl`: Extra large devices
 */
export type HoneyBreakpoints = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type HoneyBreakpointName = keyof HoneyBreakpoints;

export type HoneyContainer = {
  /**
   * Max container width in any CSS distance value.
   */
  maxWidth: HoneyCSSDimensionValue;
};

/**
 * Represents the theme configuration.
 */
export interface BaseHoneyTheme {
  /**
   * Breakpoints for responsive design, where keys are breakpoint names and values are breakpoint values.
   */
  breakpoints: Partial<HoneyBreakpoints>;
  /**
   * Configuration for the container.
   */
  container: Partial<HoneyContainer>;
  /**
   * Spacing values used throughout the theme.
   */
  spacings: HoneySpacings;
  /**
   * Font settings used throughout the theme.
   */
  fonts: HoneyFonts;
  /**
   * Color palette used throughout the theme.
   */
  colors: HoneyColors;
  /**
   * Dimension values used throughout the theme.
   */
  dimensions: HoneyDimensions;
}

export interface HoneyTheme extends BaseHoneyTheme {}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends HoneyTheme {}
}

export type HoneyThemedProps<T = unknown> = { theme: DefaultTheme } & T;

/**
 * A type representing a function that returns a value for a specific CSS property based on the provided theme.
 *
 * @template CSSProperty - The CSS property this function will generate a value for.
 */
type HoneyCSSPropertyValueFn<CSSProperty extends keyof CSS.Properties> = (
  props: HoneyThemedProps,
) => CSS.Properties[CSSProperty];

/**
 * Type representing numeric values for CSS dimension properties.
 *
 * If `CSSProperty` extends `HoneyCSSDimensionProperty`, this type will be a single value or an array of numbers,
 * allowing for spacing properties that can have single or multiple numeric values (e.g., margin, padding).
 * Otherwise, it results in `never`, indicating that non-distance properties are not included.
 *
 * @template CSSProperty - The key of a CSS property to check.
 */
type HoneyCSSDimensionNumericValue<CSSProperty extends keyof CSS.Properties> =
  CSSProperty extends HoneyCSSDimensionProperty ? HoneyCSSMultiValue<number> : never;

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
 * Defines a type representing a set of CSS properties where each property key is prefixed with a dollar sign ($).
 */
export type HoneyCSSProperties = Partial<{
  [CSSProperty in keyof CSS.Properties as `$${CSSProperty}`]: HoneyCSSPropertyValue<CSSProperty>;
}>;

/**
 * Represents the state of the screen layout.
 */
export type HoneyScreenState = {
  /** Indicates if the screen size is extra-small (xs). */
  isXs: boolean;
  /** Indicates if the screen size is small (sm). */
  isSm: boolean;
  /** Indicates if the screen size is medium (md). */
  isMd: boolean;
  /** Indicates if the screen size is large (lg). */
  isLg: boolean;
  /** Indicates if the screen size is extra-large (xl). */
  isXl: boolean;
  /** Indicates if the screen orientation is portrait. */
  isPortrait: boolean;
  /** Indicates if the screen orientation is landscape. */
  isLandscape: boolean;
};

/**
 * Defines different spacing sizes available in the theme.
 */
export type HoneySpacings = {
  /**
   * The base spacing value in pixels.
   */
  base: number;
  // Additional spacing sizes
  small?: number;
  medium?: number;
  large?: number;
};

/**
 * Defines the color palette used in the theme.
 */
export interface BaseHoneyColors {
  /**
   * Used for elements that require high visibility and emphasis, such as primary buttons, call-to-action elements,
   * and important elements like headers or titles.
   */
  primary: Record<string, HoneyCSSColor>;
  /**
   * Used to complement the primary color and add visual interest.
   * Often used for secondary buttons, borders, and decorative elements to provide contrast and balance within the design.
   * Helps create a cohesive visual hierarchy by providing variation in color tones.
   */
  secondary: Record<string, HoneyCSSColor>;
  /**
   * Used to draw attention to specific elements or interactions.
   * Often applied to interactive elements like links, icons, or tooltips to indicate their interactive nature.
   * Can be used sparingly to highlight important information or to create visual focal points.
   */
  accent: Record<string, HoneyCSSColor>;
  /**
   * Used for backgrounds, text, and other elements where a subtle, non-distracting color is desired.
   * Provides a versatile palette for elements like backgrounds, borders, text, and icons, allowing other colors to stand
   * out more prominently. Helps maintain balance and readability without overwhelming the user with too much color.
   */
  neutral: Record<string, HoneyCSSColor>;
  /**
   * Used to indicate successful or positive actions or states.
   * Often applied to elements like success messages, notifications, or icons to convey successful completion of tasks or operations.
   * Provides visual feedback to users to indicate that their actions were successful.
   */
  success: Record<string, HoneyCSSColor>;
  /**
   * Used to indicate cautionary or potentially risky situations.
   * Applied to elements like warning messages, alerts, or icons to notify users about potential issues or actions that require attention.
   * Helps users recognize and address potential problems or risks before they escalate.
   */
  warning: Record<string, HoneyCSSColor>;
  /**
   * Used to indicate errors, critical issues, or potentially destructive actions.
   * Applied to elements like error messages, validation indicators, form fields, or delete buttons to alert users about incorrect input,
   * system errors, or actions that may have irreversible consequences. Provides visual feedback to prompt users to
   * take corrective actions or seek assistance when encountering errors or potentially risky actions.
   */
  error: Record<string, HoneyCSSColor>;
}

/**
 * Example of augmenting the colors interface.
 *
 * @example
 * ```typescript
 * declare module '@react-hive/honey-layout' {
 *  interface HoneyColors {
 *    neutral: Record<'charcoalDark' | 'charcoalGray' | 'crimsonRed', HoneyCSSColor>;
 *  }
 * }
 * ```
 */
export interface HoneyColors extends BaseHoneyColors {}

/**
 * Generates a union of all possible color keys by combining each property of `HoneyColors` with its corresponding keys.
 *
 * This type iterates over each key in the `HoneyColors` interface and creates a string template,
 * which combines the color type with each of its keys. The result is a union of all possible color keys.
 *
 * @example
 *
 * Given the `HoneyColors` interface:
 * ```typescript
 * interface HoneyColors {
 *   primary: Record<'blue' | 'green', HoneyCSSColor>;
 *   neutral: Record<'charcoalDark' | 'charcoalGray' | 'crimsonRed', HoneyCSSColor>;
 * }
 * ```
 *
 * The resulting `HoneyColorKey` type will be:
 * ```typescript
 * type HoneyColorKey = 'neutral.charcoalDark' | 'neutral.charcoalGray' | 'neutral.crimsonRed' | 'primary.blue' | 'primary.green';
 * ```
 */
export type HoneyColorKey = {
  [ColorType in keyof HoneyColors]: `${ColorType}.${keyof HoneyColors[ColorType] & string}`;
}[keyof HoneyColors];

export type HoneyFont = {
  size: number;
  family?: string;
  weight?: number;
  lineHeight?: number;
  letterSpacing?: number;
};

/**
 * Example of augmenting the fonts interface.
 *
 * @example
 * ```typescript
 * declare module '@react-hive/honey-layout' {
 *  interface HoneyFonts {
 *    body: HoneyFont;
 *    caption: HoneyFont;
 *  }
 * }
 * ```
 */
export interface HoneyFonts {
  [key: string]: HoneyFont;
}

export type HoneyFontName = keyof HoneyFonts;

/**
 * Represents a map of dimension names to CSS distance values.
 */
export interface HoneyDimensions {
  [key: string]: HoneyCSSDimensionValue;
}

export type HoneyDimensionName = keyof HoneyDimensions;

export type ComponentWithAs<T, P = object> = {
  as?: string | ComponentType<P>;
} & T;

export type HoneyModifierResultFn = () => Interpolation<HoneyThemedProps>;

export type HoneyModifier<Config = unknown> = (config?: Config) => HoneyModifierResultFn;

/**
 * Type definition for status content options in a component.
 *
 * This type is used to provide properties for handling different states of a component,
 * such as loading, error, and no content states, along with the content to display in each state.
 *
 * @template T - An optional generic type parameter to extend the type with additional properties.
 */
export type HoneyStatusContentOptions<T = unknown> = {
  /**
   * A flag indicating whether the component is in a loading state.
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * A flag indicating whether the component has encountered an error.
   *
   * @default false
   */
  isError?: boolean;
  /**
   * A flag indicating whether the component has no content to display.
   *
   * @default false
   */
  isNoContent?: boolean;
  /**
   * The content to display when the component is in a loading state.
   *
   * @default null
   */
  loadingContent?: ReactNode;
  /**
   * The content to display when the component has encountered an error.
   *
   * @default null
   */
  errorContent?: ReactNode;
  /**
   * The content to display when the component has no content to display.
   *
   * @default null
   */
  noContent?: ReactNode;
} & T;

/**
 * Represents an item that has been flattened with additional properties for hierarchical data structures.
 *
 * @template OriginItem - The type of the original item.
 * @template NestedListKey - The key within `Item` that contains nested items or lists.
 */
export type HoneyFlattenedItem<OriginItem extends object, NestedListKey extends string> = Omit<
  OriginItem,
  // Remove `NestedListKey` from the keys of `Item`
  NestedListKey
> & {
  /**
   * Optional id of the parent item in the flattened structure.
   * Used to establish parent-child relationships in hierarchical data.
   */
  parentId: OriginItem[KeysWithNonArrayValues<OriginItem>] | undefined;
  /**
   * The depth level of the item in the flattened structure.
   * Indicates how deep the item is nested within the hierarchy.
   */
  depthLevel: number;
  /**
   * The total number of nested items within the current item.
   * Helps to keep track of the size of the nested structure.
   *
   * @default 0
   */
  totalNestedItems: number;
};
