import { css } from 'styled-components';

import type { HoneyCSSTimingFunction, HoneyModifier } from './types';

/**
 * Configuration object for the transition effect applied to visibility and opacity.
 */
type HoneyVisibilityTransitionModifierConfig = {
  /**
   * Duration of the transition in milliseconds.
   * Determines how long the transition will take to complete.
   */
  durationMs: number;
  /**
   * Timing function for the transition. Defines the rate of change during the transition.
   * It can either be a single timing function or an array of multiple functions applied sequentially.
   *
   * @default ease-in-out
   */
  timingFunction?: HoneyCSSTimingFunction | HoneyCSSTimingFunction[];
  /**
   * Additional CSS properties to include in the transition.
   */
  extraProperties?: string[];
};

/**
 * Props for applying the transition effect.
 */
export type HoneyVisibilityTransitionModifierContextProps = {
  /**
   * Determines whether the element is active.
   * If true, the transition will be applied and the element becomes visible.
   *
   * @default false
   */
  isActive?: boolean;
};

/**
 * A styled-components modifier that applies a smooth transition effect to the visibility and opacity of an element.
 *
 * This modifier smoothly fades in or out an element by transitioning its opacity and visibility properties.
 * The transition is controlled by the configuration provided, including the duration, timing function, and any extra properties to animate.
 */
export const honeyVisibilityTransitionModifier: HoneyModifier<
  HoneyVisibilityTransitionModifierConfig,
  HoneyVisibilityTransitionModifierContextProps
> =
  ({ durationMs, timingFunction = 'ease-in-out', extraProperties = [] }) =>
  ({ isActive = false }) => css`
    opacity: ${isActive ? 1 : 0};
    visibility: ${isActive ? 'visible' : 'hidden'};

    transition-property: ${['opacity', 'visibility', ...extraProperties].join(', ')};
    transition-duration: ${durationMs}ms;
    transition-timing-function: ${Array.isArray(timingFunction)
      ? timingFunction.join(', ')
      : timingFunction};
  `;
