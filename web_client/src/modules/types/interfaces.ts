export interface FileInputEvent {
  target: HTMLInputElement;
}

export interface ElementInputEvent {
  target: HTMLElement;
}

export interface PointerClickEvent {
  target: HTMLElement;
  clientX: number;
  clientY: number;
  /**
   * When dispatched in a tree, invoking this method prevents event
   * from reaching any objects other than the current object.
   */
  stopPropagation: () => void;
  /**
   * If invoked when the cancelable attribute value is true, and while
   * executing a listener for the event with passive set to false,
   * signals to the operation that caused event to be dispatched
   * that it needs to be canceled.
   */
  preventDefault: () => void;
}

export interface Position {
  type: string;
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
}

export interface Point2D {
  x: number;
  y: number;
}
