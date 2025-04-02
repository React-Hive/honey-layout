import { createContext } from 'react';

import type { DefaultTheme, Interpolation } from 'styled-components';

import type {
  HoneyColorKey,
  HoneyCSSColor,
  HoneyDimensionName,
  HoneyFontName,
  HoneyOverlayConfig,
  HoneySpacings,
  Nullable,
  HoneyScreenState,
  HoneyCSSDimensionUnit,
  HoneyCSSDimensionValue,
  HoneyCSSMultiValue,
  HoneyOverlayId,
  HoneyActiveOverlay,
} from '../types';
import type { ResolveSpacingResult } from '../helpers';

/**
 * Function to unregister a previously registered overlay.
 */
export type HoneyUnregisterOverlay = (targetOverlayId: HoneyOverlayId) => void;

/**
 * Function to register a new overlay and manage its lifecycle.
 *
 * @param overlayConfig - Configuration object for the overlay.
 */
export type HoneyRegisterOverlay = (overlayConfig: HoneyOverlayConfig) => HoneyActiveOverlay;

export interface HoneyLayoutContextValue {
  /**
   * Represents the theme object.
   */
  theme: DefaultTheme;
  /**
   * Represents the current state of the screen.
   */
  screenState: HoneyScreenState;
  /**
   * Active overlays.
   */
  overlays: HoneyActiveOverlay[];
  /**
   * Function to register a new overlay.
   */
  registerOverlay: HoneyRegisterOverlay;
  /**
   * Function to unregister an overlay.
   */
  unregisterOverlay: HoneyUnregisterOverlay;
  /**
   * Function to resolve spacing values based on a given theme.
   *
   * @template MultiValue - A type representing the spacing value(s), which could be a single value or an array of values.
   * @template Unit - The CSS unit used for the resolved spacing value, e.g., 'px', 'em'.
   *
   * @param value - The spacing value(s) to be applied, which could be a single number or an array of numbers.
   * @param [unit] - The CSS unit to use for the calculated value. Defaults to 'px'.
   * @param [type] - The type of spacing to use from the theme (e.g., 'base', 'small', 'large').
   *
   * @returns The resolved spacing value, formatted as a string with the appropriate unit.
   */
  resolveSpacing: <
    MultiValue extends HoneyCSSMultiValue<number>,
    Unit extends Nullable<HoneyCSSDimensionUnit> = 'px',
  >(
    value: MultiValue,
    unit?: Unit,
    type?: keyof HoneySpacings,
  ) => ResolveSpacingResult<MultiValue, Unit>;
  /**
   * Function to resolve color values based on the theme.
   *
   * @param colorKey - The key representing the color in the theme.
   * @param [alpha] - Optional alpha value to apply to the color for transparency.
   *
   * @returns The resolved CSS color, optionally with alpha transparency.
   */
  resolveColor: (colorKey: HoneyColorKey, alpha?: number) => HoneyCSSColor;
  /**
   * Function to resolve font styles based on the theme.
   *
   * @param fontName - The name of the font to resolve from the theme.
   *
   * @returns The CSS style rules for the specified font.
   */
  resolveFont: (fontName: HoneyFontName) => Interpolation<object>;
  /**
   * Function to resolve dimension values based on the theme.
   *
   * @param dimensionName - The name of the dimension to resolve from the theme.
   *
   * @returns The resolved CSS dimension value (e.g., width, height).
   */
  resolveDimension: (dimensionName: HoneyDimensionName) => HoneyCSSDimensionValue;
}

export const HoneyLayoutContext = createContext<HoneyLayoutContextValue | undefined>(undefined);
