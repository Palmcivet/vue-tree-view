import { Sash } from "./Sash";
import { View } from "./View";
import { EOrientation, EPriority, IViewOptions } from "./interface";
import { EventBus } from "../EventBus";
import { prefix } from "../config";
import "./index.less";

const CLASS_NAME = {
  Container: `${prefix}-splitview`,
  ViewContainer: `${prefix}-view__container`,
  SashContainer: `${prefix}-sash__container`,
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export class SplitView extends EventBus {
  private readonly root: HTMLElement;

  private readonly viewContainer: HTMLElement;

  private readonly sashContainer: HTMLElement;

  private sashItems: Array<Sash>;

  private viewItems: Array<View>;

  constructor(root: HTMLElement) {
    super();
    this.sashItems = [];
    this.viewItems = [];
    this.root = root;
    this.root.classList.add(CLASS_NAME.Container);
    this.viewContainer = document.createElement("div");
    this.viewContainer.className = CLASS_NAME.ViewContainer;
    this.sashContainer = document.createElement("div");
    this.sashContainer.className = CLASS_NAME.SashContainer;
    this.root.appendChild(this.viewContainer);
    this.root.appendChild(this.sashContainer);
  }

  public invoke(): void {
    this._register(true);
  }

  public dispose(): void {
    this.clear();
    this._register(false);
    this.root.classList.remove(CLASS_NAME.Container);
    this.root.removeChild(this.viewContainer);
    this.root.removeChild(this.sashContainer);
    this.sashItems.forEach((sash) => sash.dispose());
    this.viewItems.forEach((view) => view.dispose());
    this.sashItems = [];
    this.viewItems = [];
  }

  /**
   * @description 添加 View
   */
  public addView(opt: IViewOptions, index: number = this.viewItems.length): void {
    // TODO 校验参数
    const {
      element,
      initialSize = 0,
      minimumSize = 0,
      maximumSize = Number.POSITIVE_INFINITY,
      orientation = EOrientation.VERTICAL,
      priority = EPriority.High,
    } = opt;

    const view = new View({
      element,
      priority,
      initialSize,
      minimumSize,
      maximumSize,
      orientation,
    });

    /* 校验 index */
    let viewIndex;
    let sashIndex;
    let isAtTail;
    if (index > 0 && index < this.viewItems.length) {
      viewIndex = index;
      sashIndex = index - 1;
      isAtTail = false;
    } else if (index === 0) {
      viewIndex = 0;
      sashIndex = 0;
      isAtTail = false;
    } else {
      viewIndex = this.viewItems.length;
      sashIndex = this.sashItems.length;
      isAtTail = true;
    }

    this.viewItems.splice(viewIndex, 0, view);

    if (this.viewItems.length > 1) {
      const sash = new Sash(this.viewContainer, orientation);

      this.sashItems.splice(sashIndex, 0, sash);

      if (isAtTail) {
        this.sashContainer.appendChild(sash.getElement());
      } else {
        this.sashContainer.insertBefore(sash.getElement(), this.sashContainer.children.item(sashIndex));
      }
    }

    if (isAtTail) {
      this.viewContainer.appendChild(view.getElement());
    } else {
      this.viewContainer.insertBefore(view.getElement(), this.viewContainer.children.item(viewIndex));
    }

    this._distributeSize();
  }

  /**
   * @description 移除 View
   */
  public removeView(index: number = this.viewItems.length - 1): void {
    let viewIndex;
    let sashIndex;
    if (index > 0 && index < this.viewItems.length) {
      viewIndex = index;
      sashIndex = index - 1;
    } else if (index === 0) {
      viewIndex = 0;
      sashIndex = 0;
    } else {
      viewIndex = this.viewItems.length - 1;
      sashIndex = this.sashItems.length - 1;
    }

    this.viewItems.splice(viewIndex, 1);
    this.viewContainer.removeChild(this.viewContainer.children.item(viewIndex)!);
    this.sashItems.splice(sashIndex, 1);
    this.sashContainer.removeChild(this.sashContainer.children.item(sashIndex)!);

    this._distributeSize();
  }

  /**
   * @description 显隐 View
   */
  public toggleView(): void {}

  /**
   * @description 容器尺寸缩放，子元素均匀缩放
   */
  public doResize(): void {
    this.onResize();
  }

  /* 以下为工具函数 */

  /**
   * @description 均分布局
   */
  private _distributeSize(): void {
    let fixedWidth = 0;
    let fixedNumber = 0;
    this.viewItems.forEach((view) => {
      if (view.priority === EPriority.Low) {
        fixedWidth += view.getSize();
        fixedNumber += 1;
      }
    });

    const meanWidth = (this.root.clientWidth - fixedWidth) / (this.viewItems.length - fixedNumber);

    this.viewItems.forEach((view) => {
      if (view.priority === EPriority.Low) {
        return;
      }
      if (meanWidth < view.minimumSize) {
        return;
      }
      view.setSize(meanWidth);
    });

    this.sashItems.forEach((sash, index) => {
      const element = this.sashContainer.children.item(index) as HTMLElement;
      element.dataset.index = index.toString();
    });

    this._layout();
  }

  /**
   * @description 布局
   */
  private _layout(): void {
    const position = {
      width: 0,
      height: 0,
    };

    this.viewItems.forEach((view, index) => {
      view.layout(position.width);
      const sash = this.sashItems[Math.max(index - 1, 0)];
      sash?.layout(position.width);
      position.width += view.getSize();
    });
  }

  /**
   * @description 注册事件
   */
  private _register(flag: boolean): void {
    let activeSashIndex = 0;
    let startPointX = 0;
    let startOffsetX = 0;
    let prevWidth = 0;
    let nextWidth = 0;

    const onDragStart = (event: MouseEvent): void => {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", onDragEnd);

      const target = event.target as HTMLElement;
      const index = Number.parseInt(target.dataset.index!);

      activeSashIndex = index;
      startPointX = event.clientX;
      startOffsetX = this.sashItems[index].getPosition();
      prevWidth = this.viewItems[index].getSize();
      nextWidth = this.viewItems[index + 1].getSize();
    };

    const onDrag = (event: MouseEvent): void => {
      const offset = event.clientX - startPointX;
      const prevView = this.viewItems[activeSashIndex];
      const nextView = this.viewItems[activeSashIndex + 1];

      const finalPrevWidth = clamp(prevWidth + offset, prevView.minimumSize, prevView.maximumSize);
      const finalNextWidth = clamp(nextWidth - offset, nextView.minimumSize, nextView.maximumSize);

      if (prevWidth + offset !== finalPrevWidth || nextWidth - offset !== finalNextWidth) {
        return;
      }

      prevView.setSize(finalPrevWidth);
      nextView.setSize(finalNextWidth);
      nextView.layout(startOffsetX + offset);
      this.sashItems[activeSashIndex].layout(startOffsetX + offset);
    };

    const onDragEnd = (event: MouseEvent): void => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", onDragEnd);
    };

    if (flag) {
      this.sashContainer.addEventListener("mousedown", onDragStart);
    } else {
      this.sashContainer.removeEventListener("mousedown", onDragStart);
    }
  }

  /* 以下为事件响应 */

  private onResize(): void {
    this._distributeSize();
  }
}
