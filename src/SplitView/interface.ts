export enum EPriority {
  Low = -1,
  High = 1,
}

export enum EOrientation {
  VERTICAL,
  HORIZONTAL,
}

export interface IViewOptions {
  element: HTMLElement;
  initialSize?: number;
  minimumSize?: number;
  maximumSize?: number;
  orientation?: EOrientation;
  priority?: EPriority;
}

export interface IView extends Required<IViewOptions> {}

export interface ISashEvent extends MouseEvent {}
