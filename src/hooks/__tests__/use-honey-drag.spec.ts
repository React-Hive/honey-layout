import { act, renderHook } from '@testing-library/react';

import { useHoneyDrag } from '../use-honey-drag';
import {
  createTouch,
  dispatchWindowMouseEvent,
  dispatchWindowTouchEvent,
  setupDraggableElement,
} from './use-honey-drag.test-utils';
import type { HoneyDragMoveContext } from '../use-honey-drag';

describe('[useHoneyDrag]: mouse-based dragging interaction', () => {
  const { getDraggableElement, dispatchDraggableElementMouseEvent } = setupDraggableElement();

  it('should call all handlers during a successful mouse drag', async () => {
    const startDragSpy = jest.fn((draggableElement: HTMLElement) => Promise.resolve(true));
    const moveDragSpy = jest.fn((draggableElement: HTMLElement) => Promise.resolve(true));
    const endDragSpy = jest.fn((draggableElement: HTMLElement) => Promise.resolve());

    const draggableElement = getDraggableElement();

    renderHook(() =>
      useHoneyDrag(
        { current: draggableElement },
        {
          onStartDrag: draggableElement => startDragSpy(draggableElement),
          onMoveDrag: draggableElement => () => moveDragSpy(draggableElement),
          onEndDrag: (context, draggableElement) => endDragSpy(draggableElement),
        },
      ),
    );

    await act(async () =>
      dispatchDraggableElementMouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      }),
    );

    await act(async () =>
      dispatchWindowMouseEvent('mousemove', {
        clientX: 120,
        clientY: 130,
      }),
    );

    await act(async () => dispatchWindowMouseEvent('mouseup'));

    expect(startDragSpy).toHaveBeenCalledTimes(1);
    expect(startDragSpy).toHaveBeenCalledWith(draggableElement);

    expect(moveDragSpy).toHaveBeenCalledTimes(1);
    expect(moveDragSpy).toHaveBeenCalledWith(draggableElement);

    expect(endDragSpy).toHaveBeenCalledTimes(1);
    expect(endDragSpy).toHaveBeenCalledWith(draggableElement);
  });

  it('should not call move or end handlers when start returns false', async () => {
    const startDragSpy = jest.fn(() => Promise.resolve(false));
    const moveDragSpy = jest.fn(() => Promise.resolve(true));
    const endDragSpy = jest.fn(() => Promise.resolve());

    const draggableElement = getDraggableElement();

    renderHook(() =>
      useHoneyDrag(
        { current: draggableElement },
        {
          onStartDrag: () => startDragSpy(),
          onMoveDrag: () => () => moveDragSpy(),
          onEndDrag: () => endDragSpy(),
        },
      ),
    );

    await act(async () =>
      dispatchDraggableElementMouseEvent('mousedown', {
        clientX: 450,
        clientY: 200,
      }),
    );

    await act(async () =>
      dispatchWindowMouseEvent('mousemove', {
        clientX: 420,
        clientY: 300,
      }),
    );

    await act(async () => dispatchWindowMouseEvent('mouseup'));

    expect(startDragSpy).toHaveBeenCalled();
    expect(moveDragSpy).not.toHaveBeenCalled();
    expect(endDragSpy).not.toHaveBeenCalled();
  });

  it('should pass correct delta and distance values in move context', async () => {
    const moveDragSpy = jest.fn((context: HoneyDragMoveContext) => Promise.resolve(true));

    const draggableElement = getDraggableElement();

    renderHook(() =>
      useHoneyDrag(
        { current: draggableElement },
        {
          onMoveDrag: () => context => moveDragSpy(context),
        },
      ),
    );

    await act(async () =>
      dispatchDraggableElementMouseEvent('mousedown', {
        clientX: 340,
        clientY: 420,
      }),
    );

    await act(async () =>
      dispatchWindowMouseEvent('mousemove', {
        clientX: 260,
        clientY: 520,
      }),
    );

    expect(moveDragSpy).toHaveBeenNthCalledWith(1, {
      deltaX: -80,
      deltaY: 100,
      distanceX: -80,
      distanceY: 100,
    });

    await act(async () =>
      dispatchWindowMouseEvent('mousemove', {
        clientX: 360,
        clientY: 230,
      }),
    );

    await act(async () => dispatchWindowMouseEvent('mouseup'));

    expect(moveDragSpy).toHaveBeenNthCalledWith(2, {
      deltaX: 100,
      deltaY: -290,
      distanceX: 20,
      distanceY: -190,
    });
  });

  it('should not trigger any handlers when dragging is disabled via enabled is false', async () => {
    const startDragSpy = jest.fn(() => Promise.resolve(true));
    const moveDragSpy = jest.fn(() => Promise.resolve(true));
    const endDragSpy = jest.fn(() => Promise.resolve());

    const draggableElement = getDraggableElement();

    renderHook(() =>
      useHoneyDrag(
        { current: draggableElement },
        {
          enabled: false,
          onStartDrag: () => startDragSpy(),
          onMoveDrag: () => () => moveDragSpy(),
          onEndDrag: () => endDragSpy(),
        },
      ),
    );

    await act(async () =>
      dispatchDraggableElementMouseEvent('mousedown', {
        clientX: 230,
        clientY: 50,
      }),
    );

    await act(async () =>
      dispatchWindowMouseEvent('mousemove', {
        clientX: 500,
        clientY: 250,
      }),
    );

    await act(async () => dispatchWindowMouseEvent('mouseup'));

    expect(startDragSpy).not.toHaveBeenCalled();
    expect(moveDragSpy).not.toHaveBeenCalled();
    expect(endDragSpy).not.toHaveBeenCalled();
  });

  it('should skip calling end handler when move handler returns false and `skipOnEndDragWhenStopped` is true', async () => {
    const startDragSpy = jest.fn(() => Promise.resolve(true));
    const moveDragSpy = jest.fn(() => Promise.resolve(false));
    const endDragSpy = jest.fn(() => Promise.resolve());

    const draggableElement = getDraggableElement();

    renderHook(() =>
      useHoneyDrag(
        { current: draggableElement },
        {
          skipOnEndDragWhenStopped: true,
          onStartDrag: () => startDragSpy(),
          onMoveDrag: () => () => moveDragSpy(),
          onEndDrag: () => endDragSpy(),
        },
      ),
    );

    await act(async () =>
      dispatchDraggableElementMouseEvent('mousedown', {
        clientX: 320,
        clientY: 250,
      }),
    );

    await act(async () =>
      dispatchWindowMouseEvent('mousemove', {
        clientX: 600,
        clientY: 550,
      }),
    );

    await act(async () => dispatchWindowMouseEvent('mouseup'));

    expect(startDragSpy).toHaveBeenCalled();
    expect(moveDragSpy).toHaveBeenCalled();
    expect(endDragSpy).not.toHaveBeenCalled();
  });
});

describe('[useHoneyDrag]: touch-based dragging interaction', () => {
  const { getDraggableElement, dispatchDraggableElementTouchEvent } = setupDraggableElement();

  it('should call all handlers during a successful touch drag', async () => {
    const startDragSpy = jest.fn((draggableElement: HTMLElement) => Promise.resolve(true));
    const moveDragSpy = jest.fn((draggableElement: HTMLElement) => Promise.resolve(true));
    const endDragSpy = jest.fn((draggableElement: HTMLElement) => Promise.resolve());

    const draggableElement = getDraggableElement();

    renderHook(() =>
      useHoneyDrag(
        { current: draggableElement },
        {
          onStartDrag: draggableElement => startDragSpy(draggableElement),
          onMoveDrag: draggableElement => () => moveDragSpy(draggableElement),
          onEndDrag: (context, draggableElement) => endDragSpy(draggableElement),
        },
      ),
    );

    await act(async () =>
      dispatchDraggableElementTouchEvent('touchstart', {
        touches: [createTouch(draggableElement, 100, 100)],
      }),
    );

    await act(async () =>
      dispatchWindowTouchEvent('touchmove', {
        touches: [createTouch(draggableElement, 120, 130)],
      }),
    );

    await act(async () =>
      dispatchWindowTouchEvent('touchend', {
        changedTouches: [createTouch(draggableElement, 120, 130)],
      }),
    );

    expect(startDragSpy).toHaveBeenCalledTimes(1);
    expect(startDragSpy).toHaveBeenCalledWith(draggableElement);

    expect(moveDragSpy).toHaveBeenCalledTimes(1);
    expect(moveDragSpy).toHaveBeenCalledWith(draggableElement);

    expect(endDragSpy).toHaveBeenCalledTimes(1);
    expect(endDragSpy).toHaveBeenCalledWith(draggableElement);
  });

  it('should call all handlers when touch interaction is cancelled', async () => {
    const startDragSpy = jest.fn(() => Promise.resolve(true));
    const moveDragSpy = jest.fn(() => Promise.resolve(true));
    const endDragSpy = jest.fn(() => Promise.resolve());

    const draggableElement = getDraggableElement();

    renderHook(() =>
      useHoneyDrag(
        { current: draggableElement },
        {
          onStartDrag: () => startDragSpy(),
          onMoveDrag: () => () => moveDragSpy(),
          onEndDrag: () => endDragSpy(),
        },
      ),
    );

    await act(async () =>
      dispatchDraggableElementTouchEvent('touchstart', {
        touches: [createTouch(draggableElement, 500, 220)],
      }),
    );

    await act(async () =>
      dispatchWindowTouchEvent('touchmove', {
        touches: [createTouch(draggableElement, 420, 370)],
      }),
    );

    await act(async () => dispatchWindowTouchEvent('touchcancel'));

    expect(startDragSpy).toHaveBeenCalled();
    expect(moveDragSpy).toHaveBeenCalled();
    expect(endDragSpy).toHaveBeenCalled();
  });
});
