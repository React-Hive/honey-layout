export const createTouch = (target: EventTarget, x: number, y: number, id = 0) =>
  new Touch({
    target,
    identifier: id,
    clientX: x,
    clientY: y,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });

export const dispatchWindowMouseEvent = (eventName: string, eventData?: MouseEventInit) => {
  window.dispatchEvent(new MouseEvent(eventName, eventData));
};

export const dispatchWindowTouchEvent = (eventName: string, eventData?: TouchEventInit) => {
  window.dispatchEvent(new TouchEvent(eventName, eventData));
};

export const setupDraggableElement = () => {
  let draggableElement: HTMLDivElement;

  beforeEach(() => {
    draggableElement = document.createElement('div');
    document.body.appendChild(draggableElement);
  });

  afterEach(() => {
    document.body.removeChild(draggableElement);
  });

  const dispatchDraggableElementMouseEvent = (eventName: string, eventData?: MouseEventInit) => {
    draggableElement.dispatchEvent(new MouseEvent(eventName, eventData));
  };

  const dispatchDraggableElementTouchEvent = (eventName: string, eventData?: TouchEventInit) => {
    draggableElement.dispatchEvent(new TouchEvent(eventName, eventData));
  };

  return {
    dispatchDraggableElementMouseEvent,
    dispatchDraggableElementTouchEvent,
    getDraggableElement: () => draggableElement,
  };
};
