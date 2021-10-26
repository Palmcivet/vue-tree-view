import { prefix } from "../config";

const CLASS_NAME = {
  Box: `${prefix}-inputbox`,
  Mask: `${prefix}-inputmask`,
};

interface IFocusPoint {
  x: number;
  y: number;
}

export class InputBox {
  /**
   * @description 挂载的根节点
   */
  private readonly root: HTMLElement;

  /**
   * @description 输入框
   */
  private readonly box: HTMLInputElement;

  /**
   * @description 遮罩层
   */
  private readonly mask!: HTMLElement;

  /**
   * @description 编辑状态
   */
  private isEditing: boolean = false;

  constructor(root: HTMLElement) {
    this.root = root;
    this.box = document.createElement("input");
    this.box.className = CLASS_NAME.Box;
    this.box.spellcheck = false;
    this.box.style.zIndex = "99";
    this.box.style.position = "absolute";
    this.box.style.willChange = "transform";
    this.mask = document.createElement("div");
    this.mask.className = CLASS_NAME.Mask;
    this.mask.style.zIndex = "90";
    this.mask.style.position = "absolute";
    this.mask.style.top = "0";
    this.mask.style.left = "0";
    this.mask.style.right = "0";
    this.mask.style.bottom = "0";
    this.root.appendChild(this.mask);
    this.root.appendChild(this.box);
  }

  public invoke(): void {
    this._toggleVisibility(false);
    this.box.addEventListener("click", this.onClickInputbox.bind(this));
    this.mask.addEventListener("click", this.onClickMask.bind(this));
  }

  public dispose(): void {
    this.box.removeEventListener("click", this.onClickInputbox);
    this.mask.removeEventListener("click", this.onClickMask);
    this.root.removeChild(this.box);
    this.root.removeChild(this.mask);
  }

  public doFocus(point: IFocusPoint, oldValue: string = ""): void {
    this.isEditing = true;
    this._toggleVisibility(true);
    this._placeInputbox(point);
    this.box.value = oldValue;
    this.box.focus();
    const { length } = oldValue.split(".").slice(0, -1).join();
    this.box.setSelectionRange(0, length);
  }

  private onClickInputbox(event: MouseEvent): void {
    event.stopPropagation();
  }

  private onClickMask(event: MouseEvent): void {
    event.stopPropagation();
    this.isEditing = false;
    this.box.value = "";
    this._toggleVisibility(false);
    this.root.focus();
  }

  private onSubmit(): void {}

  private _placeInputbox({ x, y }: IFocusPoint): void {
    this.box.style.left = `${x}px`;
    this.box.style.top = `${y}px`;
  }

  private _toggleVisibility(flag: boolean): void {
    this.box.style.display = `${flag ? "initial" : "none"}`;
    this.mask.style.visibility = `${flag ? "initial" : "hidden"}`;
  }
}
