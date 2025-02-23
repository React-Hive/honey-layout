import type { HoneyCSSColor, HoneyCSSDimensionValue } from './css.types';

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
  interface DefaultTheme extends HoneyTheme {}
}

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
interface BaseHoneyColors {
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
 * ```ts
 * declare module '@react-hive/honey-layout' {
 *  export interface HoneyColors {
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
 * ```ts
 * interface HoneyColors {
 *   primary: Record<'blue' | 'green', HoneyCSSColor>;
 *   neutral: Record<'charcoalDark' | 'charcoalGray' | 'crimsonRed', HoneyCSSColor>;
 * }
 * ```
 *
 * The resulting `HoneyColorKey` type will be:
 * ```ts
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
 * ```ts
 * declare module '@react-hive/honey-layout' {
 *  export interface HoneyFonts {
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
