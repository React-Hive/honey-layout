import { css } from 'styled-components';

import type { HoneyCSSTimingFunction, HoneyEffect } from './types';

/**
 * Configuration object for defining the transition effect on visibility and opacity.
 */
type HoneyVisibilityTransitionEffectConfig = {
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
   * These properties will be animated alongside `opacity` and `visibility`.
   */
  extraProperties?: string[];
  /**
   * Optional class name that can be applied to the active state.
   * When specified, the styles for the active state (e.g., `opacity: 1` and `visibility: visible`)
   * will also be applied when the element has this class.
   */
  activeClassName?: string;
};

/**
 * Context props used to control the transition effect.
 */
export type HoneyVisibilityTransitionEffectContextProps = {
  /**
   * Specifies whether the transition should be applied.
   * When true, the element becomes visible and transitions in; when false, it transitions out and becomes hidden.
   *
   * @default false
   */
  isActive?: boolean;
};

/**
 * A styled-components effect that applies smooth transitions to the `visibility`, `opacity`, and optional extra properties of an element.
 *
 * This effect allows you to animate the appearance or disappearance of an element, making it fade in or out.
 * The behavior is customizable via the configuration, including the duration of the transition, timing functions, and any additional
 * CSS properties you want to animate. It also supports applying an `activeClassName` to represent the active state through CSS.
 */
export const honeyVisibilityTransitionEffect: HoneyEffect<
  HoneyVisibilityTransitionEffectConfig,
  HoneyVisibilityTransitionEffectContextProps
> =
  ({ durationMs, timingFunction = 'ease-in-out', extraProperties = [], activeClassName }) =>
  ({ isActive = false }) => css`
    opacity: ${isActive ? 1 : 0};
    visibility: ${isActive ? 'visible' : 'hidden'};

    transition-property: ${['opacity', 'visibility', ...extraProperties].join(', ')};
    transition-duration: ${durationMs}ms;
    transition-timing-function: ${Array.isArray(timingFunction)
      ? timingFunction.join(', ')
      : timingFunction};

    ${activeClassName &&
    css`
      &.${activeClassName} {
        opacity: 1;
        visibility: visible;
      }
    `}
  `;
