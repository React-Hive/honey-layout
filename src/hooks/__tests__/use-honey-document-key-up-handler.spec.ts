import { renderHook } from '@testing-library/react';

import { useHoneyDocumentKeyUp } from '~/hooks';

export const dispatchDocumentKeyboardEvent = (eventName: string, eventData?: KeyboardEventInit) => {
  document.dispatchEvent(new KeyboardEvent(eventName, eventData));
};

describe('[useHoneyDocumentKeyUp]: basic behavior', () => {
  it('should call the handler when the specified key is released', () => {
    const keyUpSpy = jest.fn();

    renderHook(() => useHoneyDocumentKeyUp(keyUpSpy, ['Escape']));

    dispatchDocumentKeyboardEvent('keyup', {
      code: 'Escape',
    });

    expect(keyUpSpy).toHaveBeenCalled();
  });

  it('should not call the handler when the hook is disabled', () => {
    const keyUpSpy = jest.fn();

    renderHook(() =>
      useHoneyDocumentKeyUp(keyUpSpy, ['Tab'], {
        enabled: false,
      }),
    );

    dispatchDocumentKeyboardEvent('keyup', {
      code: 'Tab',
    });

    expect(keyUpSpy).not.toHaveBeenCalled();
  });
});
