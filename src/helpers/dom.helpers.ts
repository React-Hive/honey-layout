const FOCUSABLE_HTML_ELEMENTS_SELECTORS = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"], [type="radio"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex="0"]',
];

export const getFocusableHTMLElements = (
  container: HTMLElement,
  selectors = FOCUSABLE_HTML_ELEMENTS_SELECTORS,
): NodeListOf<HTMLElement> => container.querySelectorAll(selectors.join(','));
