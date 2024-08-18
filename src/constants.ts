import type { HTMLAttributes } from 'react';

import type { HoneyCSSColorProperty, HoneyCSSDimensionProperty } from './types';

export const HTML_ATTRIBUTES: (keyof HTMLAttributes<HTMLElement>)[] = [
  // Standard HTML Attributes
  'accessKey',
  'autoFocus',
  'contentEditable',
  'contextMenu',
  'dir',
  'draggable',
  'hidden',
  'id',
  'lang',
  'nonce',
  'slot',
  'spellCheck',
  'tabIndex',
  'title',
  'translate',
  // WAI-ARIA
  'role',
  // Non-standard Attributes
  'autoCapitalize',
  'autoCorrect',
  'autoSave',
  'color',
  'itemProp',
  'itemScope',
  'itemType',
  'itemID',
  'itemRef',
  'results',
  'security',
  'unselectable',
  // Living Standard
  'inputMode',
  'is',
  // DOM
  'children',
];

export const CSS_DIMENSION_PROPERTIES: HoneyCSSDimensionProperty[] = [
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

export const CSS_COLOR_PROPERTIES: HoneyCSSColorProperty[] = [
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
