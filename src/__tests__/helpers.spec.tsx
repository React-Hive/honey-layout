import { bpMedia } from '../helpers';
import type { HoneyTheme } from '../types';

const theme: HoneyTheme = {
  breakpoints: {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200,
  },
  container: {
    maxWidth: '1450px',
  },
  spacings: {
    base: 8,
  },
  fonts: {
    body: {
      size: 14,
    },
  },
  dimensions: {},
  colors: {
    primary: {},
    secondary: {},
    accent: {},
    neutral: {
      charcoalDark: '#222222',
    },
    success: {},
    warning: {},
    error: {},
  },
};

describe('[helpers]: breakpoint media function', () => {
  it('should generate correct max-width media query string for "xs" breakpoint', () => {
    expect(bpMedia('xs').down({ theme })).toBe('@media screen and (max-width: 480px)');
  });

  it('should generate correct max-width media query string for "md" breakpoint', () => {
    expect(bpMedia('md').down({ theme })).toBe('@media screen and (max-width: 992px)');
  });

  it('should generate correct max-width media query string for "lg" breakpoint', () => {
    expect(bpMedia('lg').down({ theme })).toBe('@media screen and (max-width: 1200px)');
  });

  it('should generate correct min-width media query string for "xs" breakpoint', () => {
    expect(bpMedia('xs').up({ theme })).toBe('@media screen and (min-width: 480px)');
  });

  it('should generate correct min-width media query string for "md" breakpoint', () => {
    expect(bpMedia('md').up({ theme })).toBe('@media screen and (min-width: 992px)');
  });

  it('should generate correct min-width media query string for "lg" breakpoint', () => {
    expect(bpMedia('lg').up({ theme })).toBe('@media screen and (min-width: 1200px)');
  });

  it('should generate correct media query string for "md" breakpoint with orientation "landscape"', () => {
    expect(
      bpMedia('md', {
        orientation: 'landscape',
      }).up({ theme }),
    ).toBe('@media screen and (min-width: 992px) and (orientation: landscape)');
  });

  it('should generate correct media query string for "md" breakpoint with media type "all"', () => {
    expect(
      bpMedia('md', {
        mediaType: 'all',
      }).up({ theme }),
    ).toBe('@media all and (min-width: 992px)');
  });
});
