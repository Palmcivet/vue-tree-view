import { prefix } from "../config";
import { EOrientation, EPriority, IView } from "./interface";

const CLASS_NAME = {
  View: `${prefix}-view`,
};

export class View {
  public readonly minimumSize: number;

  public readonly maximumSize: number;

  public readonly priority: EPriority;

  private readonly element: HTMLElement;

  private readonly orientation: EOrientation;

  private _size!: number;

  private _visible: boolean = true;

  constructor(view: IView) {
    this.element = view.element;
    this.element.className = CLASS_NAME.View;
    this.priority = view.priority;
    this.minimumSize = view.minimumSize;
    this.maximumSize = view.maximumSize;
    this.orientation = view.orientation;

    this.setSize(view.initialSize);
  }

  public dispose(): void {}

  public getElement() {
    return this.element;
  }

  public getVisible(): boolean {
    return this._visible;
  }

  public setVisible(visible: boolean): void {
    this._visible = visible;
  }

  public getSize(): number {
    return this._size;
  }

  public setSize(size: number): void {
    this._size = size;
    if (this.orientation === EOrientation.VERTICAL) {
      this.element.style.width = `${size}px`;
      this.element.style.height = "100%";
    } else {
      this.element.style.width = "100%";
      this.element.style.height = `${size}px`;
    }
  }

  public layout(position: number): void {
    if (this.orientation == EOrientation.VERTICAL) {
      this.element.style.left = `${position}px`;
    } else {
      this.element.style.top = `${position}px`;
    }
  }
}
