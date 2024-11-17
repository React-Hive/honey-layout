import * as CSS from 'csstype';

import type { ElementType } from 'react';
import type { ExecutionContext, Interpolation } from 'styled-components';
import type { DataType } from 'csstype';

import type {
  HoneyCSSColorProperty,
  HoneyCSSDimensionNumericValue,
  HoneyCSSDimensionValue,
} from './css.types';
import type { HoneyKeyboardEventCode } from './dom.types';

export type TimeoutId = ReturnType<typeof setTimeout>;

export type Nullable<T> = T | null;

export type HoneyHEXColor = `#${string}`;

export type HoneyCSSColor = DataType.NamedColor | HoneyHEXColor;

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

export type ComponentWithAs<T, P = object> = {
  as?: ElementType<P>;
} & T;

export type HoneyModifierResultFn = () => Interpolation<object>;

export type HoneyModifier<Config = unknown> = (config?: Config) => HoneyModifierResultFn;

export type HoneyOverlayId = string;

export type HoneyOverlayEventListenerType = 'keyup';

/**
 * Handler function for an overlay event listener.
 *
 * @param keyCode - The code of the key that triggered the event.
 * @param e - The original keyboard event.
 */
export type HoneyOverlayEventListenerHandler = (
  keyCode: HoneyKeyboardEventCode,
  e: KeyboardEvent,
) => void;

/**
 * A tuple representing an event listener, including the event type and the handler function.
 */
export type HoneyOverlayEventListener = [
  HoneyOverlayEventListenerType,
  HoneyOverlayEventListenerHandler,
];

/**
 * Configuration object for an overlay, used to specify the overlay's behavior and event handling.
 */
export type HoneyOverlayConfig = {
  /**
   * Custom overlay ID. Automatically generated if not passed.
   */
  id?: HoneyOverlayId;
  /**
   * List of keyboard event codes to listen for (e.g., "Escape", "Enter").
   * If undefined or empty, all key codes will be listened to.
   *
   * @default undefined
   */
  listenKeys?: HoneyKeyboardEventCode[];
  /**
   * Callback function to be invoked when a key event occurs for the specified key(s).
   * If `listenKeys` is provided, this will only be triggered for those keys.
   */
  onKeyUp: HoneyOverlayEventListenerHandler;
};

/**
 * Represents an overlay in the layout, allowing the registration of event listeners and notifying them when events occur.
 */
export type HoneyOverlay = {
  /**
   * Unique identifier for the overlay.
   */
  id: HoneyOverlayId;
  /**
   * Adds an event listener to the overlay.
   *
   * @param type - The type of event to listen for.
   * @param handler - The handler function to execute when the event is triggered.
   */
  addListener: (
    type: HoneyOverlayEventListenerType,
    handler: HoneyOverlayEventListenerHandler,
  ) => void;
  /**
   * Removes a specific event listener from the overlay.
   *
   * @param type - The type of event for the listener.
   * @param handler - The handler function to remove.
   */
  removeListener: (
    type: HoneyOverlayEventListenerType,
    handler: HoneyOverlayEventListenerHandler,
  ) => void;
  /**
   * Notifies all listeners of a specific event type.
   *
   * @param type - The type of event that occurred.
   * @param keyCode - The code of the key that triggered the event.
   * @param e - The original keyboard event.
   */
  notifyListeners: (
    type: HoneyOverlayEventListenerType,
    keyCode: HoneyKeyboardEventCode,
    e: KeyboardEvent,
  ) => void;
};
