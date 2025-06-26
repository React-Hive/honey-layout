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
  inputString.split(' ').filter(Boolean);

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
