import { prefix } from "../config";
import { EOrientation } from "./type";

const CLASS_NAME = {
  Sash: `${prefix}-sash`,
};

export class Sash {
  private readonly root: HTMLElement;

  private readonly element: HTMLElement;

  private readonly orientation: EOrientation = EOrientation.VERTICAL;

  private _visible: boolean = true;

  private _position: number = 0;

  private _size: number = 0;

  constructor(root: HTMLElement, orientation: EOrientation) {
    this.element = document.createElement("div");
    this.element.className = CLASS_NAME.Sash;
    this.root = root;
    this.root.appendChild(this.element);
    this.orientation = orientation;
    this.setSize(2);
  }

  public dispose(): void {
    this.root.removeChild(this.element);
  }

  public getElement(): HTMLElement {
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
    if (this.orientation == EOrientation.VERTICAL) {
      this.element.style.width = `${size}px`;
      this.element.style.height = "100%";
    } else {
      this.element.style.width = "100%";
      this.element.style.height = `${size}px`;
    }
  }

  public layout(position: number): void {
    this._position = position;
    // TODO 居中
    if (this.orientation == EOrientation.VERTICAL) {
      this.element.style.left = `${position}px`;
    } else {
      this.element.style.top = `${position}px`;
    }
  }

  public getPosition(): number {
    return this._position;
  }
}
