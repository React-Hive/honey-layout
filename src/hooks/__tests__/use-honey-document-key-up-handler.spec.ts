import { renderHook } from '@testing-library/react';

import { useHoneyDocumentKeyUpHandler } from '../use-honey-document-key-up-handler';

export const dispatchDocumentKeyboardEvent = (eventName: string, eventData?: KeyboardEventInit) => {
  document.dispatchEvent(new KeyboardEvent(eventName, eventData));
};

describe('[useHoneyDocumentKeyUpHandler]: basic behavior', () => {
  it('should call the handler when the specified key is released', () => {
    const keyUpSpy = jest.fn();

    renderHook(() => useHoneyDocumentKeyUpHandler(keyUpSpy, ['Escape']));

    dispatchDocumentKeyboardEvent('keyup', {
      code: 'Escape',
    });

    expect(keyUpSpy).toHaveBeenCalled();
  });

  it('should not call the handler when the hook is disabled', () => {
    const keyUpSpy = jest.fn();

    renderHook(() =>
      useHoneyDocumentKeyUpHandler(keyUpSpy, ['Tab'], {
        enabled: false,
      }),
    );

    dispatchDocumentKeyboardEvent('keyup', {
      code: 'Tab',
    });

    expect(keyUpSpy).not.toHaveBeenCalled();
  });
});
