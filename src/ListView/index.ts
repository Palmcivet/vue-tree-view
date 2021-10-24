import { prefix } from "../config";
import EventBus from "../EventBus";
import { Scrollbar } from "../Scrollbar";

/**
 * @var 为实现平滑滚动而补足的数据项数量
 */
const DSURPLUS_COUNT = 0;
/**
 * @var 跑道的魔数，计算时需去除该数目
 */
const RUNWAY_COUNT = 1;
/**
 * @var 跑道的尺寸（宽和高）
 */
const RUNWAY_SIZE = 1;

const CLASS_NAME = {
  Root: "unitext-listview",
  Item: `${prefix}-list__item`,
  Runway: `${prefix}-list__runway`,
  Container: `${prefix}-list__wrapper`,
};

export type EventType = "click" | "dbclick" | "contextmenu";

export interface IListViewOptions<T> {
  /**
   * @member 容器的标签
   */
  tagName: keyof HTMLElementTagNameMap;
  /**
   * @member 自定义容器的类名
   */
  className: string;
  /**
   * @member 是否可拖拽
   */
  draggable: boolean;
  /**
   * @member 滚动条是否可隐藏
   */
  suppressible: boolean;
  /**
   * @member 数据项高度
   */
  itemHeight: number;
  /**
   * @member 容器宽度是否固定
   */
  fixedSize: boolean;
  /**
   * @member 节点创建函数
   */
  createHandler(): HTMLElement;
  /**
   * @member 节点渲染函数
   * @param element DOM 元素节点
   * @param data 数据
   * @param index 数据的逻辑索引
   */
  renderHandler(element: HTMLElement, data: T, index: number, ...args: any[]): void;
}

export class ListView<T> extends EventBus<EventType> {
  /**
   * @description 挂载的节点
   */
  private readonly root: HTMLElement;

  /**
   * @description 容器的节点
   */
  private readonly container: HTMLElement;

  /**
   * @description 撑开容器的元素
   */
  private readonly runway: HTMLDivElement;

  /**
   * @description 滚动条
   */
  private readonly scrollbar: Scrollbar;

  /**
   * @description  缓存尺寸以减少 DOM 渲染
   */
  private readonly cachedValue = {
    /**
     * @description 滚动条宽度
     */
    scrollbarWidth: 0,
    /**
     * @description 高度
     */
    virtualContainerHeight: 0,
  };

  /**
   * @description 实际数据
   */
  private sourceList: Array<T> = [];

  /**
   * @description 视口待展示的数据量
   */
  private get virtualItemCount() {
    const { clientHeight } = this.container;
    this.cachedValue.virtualContainerHeight = clientHeight;
    return Math.ceil(clientHeight / this.options.itemHeight) + DSURPLUS_COUNT;
  }

  /**
   * @description 内容的实际高度
   */
  private get actualContainerHeight() {
    return this.sourceList.length * this.options.itemHeight;
  }

  /**
   * @description 配置项
   */
  private options!: IListViewOptions<T>;

  constructor(root: HTMLElement, options?: Partial<IListViewOptions<T>>) {
    super();

    this.options = {
      tagName: "ul",
      className: CLASS_NAME.Container,
      suppressible: true,
      draggable: true,
      fixedSize: true,
      itemHeight: 24,
      createHandler: () => document.createElement(tagName),
      renderHandler: () => {},
      ...options,
    };
    const { tagName, className } = this.options;
    this.root = root;
    this.root.classList.add(CLASS_NAME.Root);
    this.scrollbar = new Scrollbar(this.root);
    this.container = document.createElement(tagName);
    this.container.classList.add(className);
    this.container.tabIndex = 0;
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.overflowY = "auto";
    this.container.style.position = "relative";
    this.runway = document.createElement("div");
    this.runway.className = CLASS_NAME.Runway;
    this.runway.style.width = `${RUNWAY_SIZE}px`;
    this.runway.style.height = `${RUNWAY_SIZE}px`;
    this.runway.style.position = "absolute";
    this.runway.style.willChange = "transform";
    this.container.appendChild(this.runway);
    this.root.appendChild(this.container);
  }

  /**
   * @description 启动函数
   */
  public invoke(): void {
    this.scrollbar.invoke();
    this.container.addEventListener("scroll", this.onScroll.bind(this));
    this.container.addEventListener("click", this.onClick.bind(this));
    if (!this.options.fixedSize) {
      window.addEventListener("resize", this.onResize.bind(this));
    }

    this._measureSize();
  }

  /**
   * @description 清理函数
   */
  public dispose(): void {
    this.clear();
    window.removeEventListener("resize", this.onResize);
    this.container.removeEventListener("scroll", this.onScroll);
    this.container.removeEventListener("click", this.onClick);
    this.scrollbar.dispose();
    this.root.classList.remove(CLASS_NAME.Root);
    this.root.appendChild(this.container);
  }

  /**
   * @description 更新配置
   * @param options 新的配置项
   */
  public updateOptions(options: IListViewOptions<T>): void {
    this.options = options;

    // TODO 处理新配置的更新
    this.scrollbar.updateOptions({ suppressible: options.suppressible });
  }

  /**
   * @description 增量添加数据
   *
   * - 适合懒加载
   * - 数据插入后将计算影响范围，影响视口内则将触发渲染
   *
   * @param dataList 待插入的数据域
   * @param index 可选，插入的位置
   */
  public insertData(dataList: Array<T>, index?: number): void {
    /* 处理越界行为 */
    const maxIndex = this.sourceList.length;
    const position = index === undefined || index < 0 || index > maxIndex ? maxIndex : index;

    /* 添加数据 */
    this.sourceList.splice(position, 0, ...dataList);

    /* 处理视口内的更新 */
    if (position) {
    }

    this._stretchList();
    this._renderList();
  }

  // TODO
  public deleteData(index: number, count: number = 1): Array<T> {
    const deleted = this.sourceList.splice(index, count);

    this._stretchList();
    this._recycleList();
    this._renderList();
    return deleted;
  }

  /**
   * @description 全量更新数据，但只渲染视口内数据
   * @param dataList 新数据域
   */
  public updateData(dataList: Array<T>): void {
    /* 更新数据 */
    this.sourceList = [];
    this.sourceList.push(...dataList);

    /* 动态计算各尺寸 */
    if (!this.options.fixedSize) {
      this._measureSize();
    }

    /* 更新 DOM */
    const actualList = this.container.children;
    for (let index = actualList.length - 1; index > RUNWAY_COUNT; index--) {
      this.container.removeChild(actualList[index]);
    }

    const elements = [];
    const { virtualItemCount } = this;
    for (let index = 0; index < virtualItemCount; index++) {
      elements.push(this._createListItem());
    }
    this.container.append(...elements);

    if (this.sourceList.length <= virtualItemCount) {
      this.container.scrollTo({ top: 0 });
    }

    this._stretchList();
    this._renderList();
  }

  /**
   * @description 渲染某一项
   * @param data 待渲染数据
   * @param index 待渲染数据的索引
   */
  public renderListItem(data: T, index: number): void {
    const { itemHeight } = this.options;
    const scrolledTop = this.container.scrollTop;
    const startIndex = Math.floor(scrolledTop / itemHeight);
    const elementIndex = index - startIndex;
    const element = this.container.children[elementIndex + RUNWAY_COUNT] as HTMLElement;
    this.options.renderHandler(element, data, elementIndex + RUNWAY_COUNT);
  }

  /**
   * @description 手动更新容器尺寸。对外暴露的方法
   */
  public doResize(): void {
    this.onResize();
  }

  /**
   * @description 滚动后的回调函数
   */
  private onScroll(event: Event): void {
    const { scrollTop } = event.target as HTMLElement;
    const { virtualContainerHeight } = this.cachedValue;

    /* 越界操作 */
    if (scrollTop < 0 || scrollTop + virtualContainerHeight > this.actualContainerHeight) {
      return;
    }

    this._renderList();
  }

  private onClick(event: Event): void {
    this.emit("click", event);
  }

  /**
   * @description 缩放后的回调函数
   */
  private onResize(): void {
    const cachedHeight = this.cachedValue.virtualContainerHeight;
    const actualHeight = this.container.clientHeight;

    if (cachedHeight < actualHeight) {
      /* 放大 */
      const count =
        Math.ceil(actualHeight / this.options.itemHeight) +
        DSURPLUS_COUNT -
        (this.container.children.length - RUNWAY_COUNT);

      const elements = [];
      for (let index = 0; index < count; index++) {
        elements.push(this._createListItem());
      }
      this.container.append(...elements);
    }

    if (cachedHeight > actualHeight) {
      /* 缩小 */
      // TODO 启动定时器清理节点
      this._recycleList();
    }

    this._renderList();
  }

  /**
   * @description 测量尺寸
   */
  private _measureSize(): void {}

  /**
   * @description 创建子项
   * @returns 列表子项元素节点
   */
  private _createListItem(): HTMLElement {
    const itemElement = this.options.createHandler();
    itemElement.className = CLASS_NAME.Item;
    itemElement.style.width = "100%";
    itemElement.style.position = "absolute";
    itemElement.style.boxSizing = "border-box";
    itemElement.style.willChange = "transform";
    return itemElement;
  }

  /***
   * @description 撑开容器
   */
  private _stretchList(): void {
    const x = 0; // TODO
    const y = this.actualContainerHeight - this.runway.clientHeight;
    this.runway.style.transform = `translate(${x}px, ${y}px)`;
  }

  /**
   * @description 渲染函数
   */
  private _renderList(): void {
    const { virtualItemCount } = this;
    const { itemHeight } = this.options;
    const scrolledTop = this.container.scrollTop;

    /* 偏移列表 */
    const offset = scrolledTop % itemHeight;
    const startIndex = Math.floor(scrolledTop / itemHeight);
    const endIndex = startIndex + virtualItemCount;

    /* 渲染视口数据 */
    const actualList = this.container.children;
    const virtualList = this.sourceList.slice(startIndex, endIndex);

    for (let index = 0; index < virtualItemCount; index++) {
      const element = actualList[index + RUNWAY_COUNT] as HTMLElement;
      const x = 0;
      const y = scrolledTop + index * itemHeight - offset;
      element.style.transform = `translate(${x}px, ${y}px)`;
      if (this.options.draggable) {
        element.draggable = true;
      }

      const data = virtualList[index];

      /* data 为空则是补足的元素 */
      if (!!data) {
        const actualIndex = index + startIndex;
        element.dataset.index = actualIndex.toString();
        this.options.renderHandler(element, data, actualIndex);
      }
    }
  }

  /**
   * @description 清理无用 DOM 元素
   */
  private _recycleList(): void {}
}
