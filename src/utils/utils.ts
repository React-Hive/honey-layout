import type { HoneyCSSMediaRule, HoneyHEXColor } from '../types';

export const camelToDashCase = (inputString: string): string =>
  inputString.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

/**
 * Splits a string into an array of filtered from redundant spaces words.
 *
 * @param inputString - The input string to be split.
 *
 * @returns An array of words from the input string.
 */
export const splitStringIntoWords = (inputString: string): string[] =>
  inputString.split(' ').filter(v => v);

/**
 * Converts a pixel value to rem.
 *
 * @param px - The pixel value to be converted to rem.
 * @param base - The base value for conversion. Default is 16, which is the typical root font size.
 *
 * @returns The value in rem as a string.
 */
export const pxToRem = (px: number, base: number = 16): string => `${px / base}rem`;

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param startX - The X coordinate of the starting point.
 * @param startY - The Y coordinate of the starting point.
 * @param endX - The X coordinate of the ending point.
 * @param endY - The Y coordinate of the ending point.
 *
 * @returns The Euclidean distance between the two points.
 */
export const calculateEuclideanDistance = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): number => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
};

/**
 * Calculates the moving speed.
 *
 * @param delta - The change in position (distance).
 * @param elapsedTime - The time taken to move the distance.
 *
 * @returns The calculated speed, which is the absolute value of delta divided by elapsed time.
 */
export const calculateMovingSpeed = (delta: number, elapsedTime: number): number =>
  Math.abs(delta / elapsedTime);

/**
 * Calculates the specified percentage of a given value.
 *
 * @param value - The value to calculate the percentage of.
 * @param percentage - The percentage to calculate.
 *
 * @returns The calculated percentage of the value.
 */
export const calculatePercentage = (value: number, percentage: number): number => {
  return (value * percentage) / 100;
};

/**
 * Converts a 3-character or 6-character HEX color code to an 8-character HEX with alpha (RRGGBBAA) format.
 *
 * @param hex - The 3-character or 6-character HEX color code (e.g., "#RGB" or "#RRGGBB" or "RGB" or "RRGGBB").
 * @param alpha - The alpha transparency value between 0 (fully transparent) and 1 (fully opaque).
 *
 * @throws {Error} If alpha value is not between 0 and 1, or if the hex code is invalid.
 *
 * @returns The 8-character HEX with alpha (RRGGBBAA) format color code, or null if input is invalid.
 */
export const convertHexToHexWithAlpha = (hex: string, alpha: number): HoneyHEXColor => {
  if (alpha < 0 || alpha > 1) {
    throw new Error(`[honey-layout]: Alpha "${alpha}" is not a valid hex format.`);
  }

  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

  const match = hex.match(hexRegex);
  if (!match) {
    throw new Error(`[honey-layout]: Invalid hex format.`);
  }

  const cleanHex = match[1];

  // Expand 3-character hex to 6-character hex if necessary
  const fullHex =
    cleanHex.length === 3
      ? cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2]
      : cleanHex;

  // Convert to 8-character hex with alpha
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');

  return `#${fullHex + alphaHex}`;
};

/**
 * Builds a media query string based on the provided options.
 *
 * @param rules - Conditions for the media query.
 *
 * @returns The generated media query string.
 */
export const media = (rules: HoneyCSSMediaRule[]): string => {
  const mediaRules = rules.map(rule => {
    const conditions = [
      rule.width && ['width', rule.width],
      rule.minWidth && ['min-width', rule.minWidth],
      rule.maxWidth && ['max-width', rule.maxWidth],
      rule.height && ['height', rule.height],
      rule.minHeight && ['min-height', rule.minHeight],
      rule.maxHeight && ['max-height', rule.maxHeight],
      rule.orientation && ['orientation', rule.orientation],
      rule.minResolution && ['min-resolution', rule.minResolution],
      rule.maxResolution && ['max-resolution', rule.maxResolution],
      rule.resolution && ['resolution', rule.resolution],
      rule.update && ['update', rule.update],
    ]
      .filter(Boolean)
      .map(r => r && `(${r[0]}: ${r[1]})`)
      .join(' and ');

    const operatorPart = rule.operator ? `${rule.operator} ` : '';
    const conditionsPart = conditions ? ` and ${conditions}` : '';

    return `${operatorPart}${rule.mediaType ?? 'screen'}${conditionsPart}`;
  });

  return `@media ${mediaRules.join(', ')}`;
};

interface HTMLElementTransformationValues {
  translateX: number;
  translateY: number;
}

/**
 * Get various transformation values from the transformation matrix of an element.
 *
 * @param element - The element with a transformation applied.
 *
 * @returns An object containing transformation values.
 */
export const getTransformationValues = (element: HTMLElement): HTMLElementTransformationValues => {
  const computedStyles = window.getComputedStyle(element);
  const transformValue = computedStyles.getPropertyValue('transform');

  const matrix = transformValue.match(/^matrix\((.+)\)$/);
  if (!matrix) {
    return {
      translateX: 0,
      translateY: 0,
    };
  }

  const transformMatrix = matrix[1].split(', ');

  const translateX = parseFloat(transformMatrix[4]);
  const translateY = parseFloat(transformMatrix[5]);

  return {
    translateX,
    translateY,
  };
};
