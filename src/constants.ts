import type { HoneyCSSColorProperty, HoneyCSSDimensionProperty } from './types';

export const CSS_DIMENSION_PROPERTIES: readonly HoneyCSSDimensionProperty[] = [
  'width',
  'height',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'top',
  'right',
  'bottom',
  'left',
  'gap',
  'rowGap',
  'columnGap',
];

export const CSS_COLOR_PROPERTIES: readonly HoneyCSSColorProperty[] = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'outlineColor',
  'textDecorationColor',
  'fill',
  'stroke',
];
