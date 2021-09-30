// @ts-nocheck

/**
 * - 检测挂载节点宽度和滚动条宽度，将容器宽度放大，隐藏原生滚动条
 * - 监听滚动事件，替代滚动行为
 */

import "./index.less";

type Direction = "vertical" | "horizontal";

export interface IScrollbarOptions {
  /**
   * @member 是否悬浮
   */
  isLevitative: boolean;
  /**
   * @member 是否可隐藏
   */
  suppressible: boolean;
  /**
   * @member 滚动行为
   */
  scrollBehavior: "beisaier" | "smooth";
}

export default class Scrollbar {
  /**
   * @description 滚动方向
   */
  public direction!: Direction;

  /**
   * @description 是否为垂直方向
   */
  private get isVertical() {
    return this.direction === "vertical";
  }

  /**
   * @description 挂载的容器
   */
  private readonly root!: HTMLElement;

  /**
   * @description 滚动条轨道
   */
  private readonly scrollbarThumb!: HTMLDivElement;

  /**
   * @description 滚动条
   */
  private readonly scrollbarTrack!: HTMLDivElement;

  /**
   * @description 保存挂载节点的样式
   */
  private readonly rootStyleMap: { [k: string]: string } = {};

  /**
   * @description 水平方向是否溢出
   */
  private isOverflowX!: boolean;

  /**
   * @description 垂直方向是否溢出
   */
  private get isOverflowY() {
    return false;
  }

  /**
   * @description 配置项
   */
  private options!: IScrollbarOptions;

  constructor(root: HTMLElement, direction?: Direction, options?: Partial<IScrollbarOptions>) {
    this.options = {
      suppressible: true,
      isLevitative: true,
      scrollBehavior: "smooth",
      ...options,
    };

    this.root = root;
    this.rootStyleMap = {
      position: this.root.style.position,
    };
    this.root.style.position = "relative";

    this.scrollbarTrack = document.createElement("div");
    this.scrollbarTrack.className = `unitext-scrollbar scrollbar-track ${direction}`;

    this.scrollbarThumb = document.createElement("div");
    this.scrollbarThumb.className = "scrollbar-thumb";
    this.scrollbarTrack.appendChild(this.scrollbarThumb);
  }

  public invoke(): void {
    this.root.appendChild(this.scrollbarTrack);
    this.root.addEventListener("mouseenter", this.onShowScrollbar.bind(this));
    this.root.addEventListener("mouseleave", this.onHideScrollbar.bind(this));
  }

  public dispose(): void {
    this.root.removeEventListener("mouseenter", this.onShowScrollbar);
    this.root.removeEventListener("mouseleave", this.onHideScrollbar);

    Object.keys(this.rootStyleMap).forEach((styleName) => {
      this.root.style[styleName as any] = this.rootStyleMap[styleName];
    });

    this.scrollbarTrack.removeChild(this.scrollbarThumb);
    this.root.removeChild(this.scrollbarTrack);
  }

  public updateOptions(options: Partial<IScrollbarOptions>): void {}

  public setVisibility(status: boolean): void {
    if (this.options.suppressible) {
      this.scrollbarTrack.style.display = "none";
    }
  }

  public setThumbSize(size: number): void {
    const attribute: keyof HTMLDivElement = `client${this.isVertical ? "Height" : "Width"}`;
    if (size >= this.scrollbarTrack[attribute] || size <= 0) {
      return;
    }

    this.scrollbarThumb.style[this.isVertical ? "height" : "width"] = `${size}px`;
  }

  public scrollTo(position: number): void {
    const attribute: keyof HTMLDivElement = `client${this.isVertical ? "Height" : "Width"}`;

    if (position <= 0) {
      this.scrollbarThumb.style[this.isVertical ? "top" : "left"] = "0px";
    } else if (position >= this.scrollbarTrack[attribute]) {
      this.scrollbarThumb.style[this.isVertical ? "bottom" : "right"] = "0px";
    }

    this.scrollbarThumb.style[this.isVertical ? "top" : "left"] = `${position}px`;
  }

  private onScroll() {}

  private onClick(event: MouseEvent) {
    this.scrollTo(event.clientX);
  }

  /**
   * @description 显示滚动条
   */
  private onShowScrollbar(): void {}

  /**
   * @description 隐藏滚动条
   */
  private onHideScrollbar(): void {}
}
