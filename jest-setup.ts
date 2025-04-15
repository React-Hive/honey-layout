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

if (typeof Touch === 'undefined') {
  global.Touch = function TouchInit({ identifier, target, clientX, clientY }) {
    return {
      identifier,
      target,
      clientX,
      clientY,
      pageX: clientX,
      pageY: clientY,
      screenX: clientX,
      screenY: clientY,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      force: 1,
    };
  } as any;
}
