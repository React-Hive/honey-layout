import { themeMock } from '../../__mocks__';
import { bpMedia } from '../helpers';

describe('[bpMedia]: basic behavior', () => {
  it('should generate correct max-width media query string for "xs" breakpoint', () => {
    expect(bpMedia('xs').down({ theme: themeMock })).toBe('@media screen and (max-width: 480px)');
  });

  it('should generate correct max-width media query string for "md" breakpoint', () => {
    expect(bpMedia('md').down({ theme: themeMock })).toBe('@media screen and (max-width: 992px)');
  });

  it('should generate correct max-width media query string for "lg" breakpoint', () => {
    expect(bpMedia('lg').down({ theme: themeMock })).toBe('@media screen and (max-width: 1200px)');
  });

  it('should generate correct min-width media query string for "xs" breakpoint', () => {
    expect(bpMedia('xs').up({ theme: themeMock })).toBe('@media screen and (min-width: 480px)');
  });

  it('should generate correct min-width media query string for "md" breakpoint', () => {
    expect(bpMedia('md').up({ theme: themeMock })).toBe('@media screen and (min-width: 992px)');
  });

  it('should generate correct min-width media query string for "lg" breakpoint', () => {
    expect(bpMedia('lg').up({ theme: themeMock })).toBe('@media screen and (min-width: 1200px)');
  });

  it('should generate correct media query string for "md" breakpoint with orientation "landscape"', () => {
    expect(
      bpMedia('md', {
        orientation: 'landscape',
      }).up({ theme: themeMock }),
    ).toBe('@media screen and (min-width: 992px) and (orientation: landscape)');
  });

  it('should generate correct media query string for "md" breakpoint with media type "all"', () => {
    expect(
      bpMedia('md', {
        mediaType: 'all',
      }).up({ theme: themeMock }),
    ).toBe('@media all and (min-width: 992px)');
  });
});
