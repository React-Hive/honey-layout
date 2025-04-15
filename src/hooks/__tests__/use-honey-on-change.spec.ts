import { renderHook } from '@testing-library/react';

import { useHoneyOnChange } from '../use-honey-on-change';

describe('[useHoneyOnChange]: basic behavior', () => {
  it('should not call `onChange` on initial render', () => {
    const changeSpy = jest.fn();

    renderHook(() => useHoneyOnChange(null, changeSpy));

    expect(changeSpy).not.toHaveBeenCalled();
  });

  it('should call `onChange` when the state changes', () => {
    const changeSpy = jest.fn();

    const state = {
      data: 'initial-state',
    };

    const { rerender } = renderHook(() => useHoneyOnChange(state.data, changeSpy));

    state.data = 'new-state';

    rerender();

    expect(changeSpy).toHaveBeenCalled();
  });

  it('should call cleanup function returned by `onChange` when state changes again', () => {
    const changeCleanupSpy = jest.fn();

    const state = {
      data: 'initial-state',
    };

    const { rerender, unmount } = renderHook(() =>
      useHoneyOnChange(state.data, () => {
        return changeCleanupSpy;
      }),
    );

    // Trigger first change
    state.data = 'new-state';
    rerender();

    // Trigger the second change, which should call the cleanup from the first
    state.data = 'new-state-2';
    rerender();

    expect(changeCleanupSpy).toHaveBeenCalledTimes(1);

    unmount();
    expect(changeCleanupSpy).toHaveBeenCalledTimes(2);
  });
});
