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
  HoneyOverlay,
} from '../types';
import type { ResolveSpacingResult } from '../helpers';

/**
 * Function to unregister a previously registered overlay.
 */
export type HoneyUnregisterOverlay = (targetOverlayId: HoneyOverlayId) => void;

/**
 * Function to register a new overlay and manage its lifecycle.
 *
 * @param {HoneyOverlayConfig} overlayConfig - Configuration object for the overlay.
 */
export type HoneyRegisterOverlay = (overlayConfig: HoneyOverlayConfig) => HoneyOverlay;

export type HoneyLayoutContextValue = {
  /**
   * Represents the theme object.
   */
  theme: DefaultTheme;
  /**
   * Represents the current state of the screen.
   */
  screenState: HoneyScreenState;
  /**
   * Overlays.
   */
  overlays: HoneyOverlay[];
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
   * @param {MultiValue} value - The spacing value(s) to be applied, which could be a single number or an array of numbers.
   * @param {Unit} unit - Optional. The CSS unit to use for the calculated value. Defaults to 'px'.
   * @param {keyof HoneySpacings} type - Optional. The type of spacing to use from the theme (e.g., 'base', 'small', 'large').
   *
   * @returns {ResolveSpacingResult<MultiValue, Unit>} - The resolved spacing value, formatted as a string with the appropriate unit.
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
   * @param {HoneyColorKey} colorKey - The key representing the color in the theme.
   * @param {number} [alpha] - Optional alpha value to apply to the color for transparency.
   *
   * @returns {HoneyCSSColor} - The resolved CSS color, optionally with alpha transparency.
   */
  resolveColor: (colorKey: HoneyColorKey, alpha?: number) => HoneyCSSColor;
  /**
   * Function to resolve font styles based on the theme.
   *
   * @param {HoneyFontName} fontName - The name of the font to resolve from the theme.
   *
   * @returns {Interpolation<object>} - The CSS style rules for the specified font.
   */
  resolveFont: (fontName: HoneyFontName) => Interpolation<object>;
  /**
   * Function to resolve dimension values based on the theme.
   *
   * @param {HoneyDimensionName} dimensionName - The name of the dimension to resolve from the theme.
   *
   * @returns {HoneyCSSDimensionValue} - The resolved CSS dimension value (e.g., width, height).
   */
  resolveDimension: (dimensionName: HoneyDimensionName) => HoneyCSSDimensionValue;
};

export const HoneyLayoutContext = createContext<HoneyLayoutContextValue | undefined>(undefined);
