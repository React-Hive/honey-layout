import '@testing-library/jest-dom';

class MockOrientation extends EventTarget {
  type: string = 'portrait-primary';
  angle: number = 0;

  lock = jest.fn();
  unlock = jest.fn();
}

Object.defineProperty(window.screen, 'orientation', {
  configurable: true,
  writable: true,
  value: new MockOrientation(),
});

// Object.defineProperty(window, 'innerWidth', {
//   writable: true,
//   configurable: true,
//   value: 480,
// });
// window.dispatchEvent(new Event('resize'));
