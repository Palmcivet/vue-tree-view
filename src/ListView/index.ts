/**
 * ListView 在 TreeView 的应用场景下，ListItem 有以下鼠标事件：
 * - 单击
 * - 双击
 * - 右击
 * - 滚动
 *
 * 有以下键盘事件：
 * - 上/下：active 项向上滚动
 * - 左/右：关闭/打开文件夹，active 移出/移入
 * - 空格：选中（同单击）
 * - 回车：重命名
 *
 * 打开文件夹，则该文件夹后面的内容将重新渲染，涉及到以下部分：
 * - 文件夹/文件图标切换
 * - 指示图标切换
 * - 缩进线
 * - 文件夹/文件标题
 *
 * ListView 在通用的应用场景下，ListItem 提供以下方法：
 * - insertData(data, index)：增量添加数据，适合懒加载
 * - updateData(data)：全量更新数据，但只渲染视口内数据，成本较低
 * - resize()：手动更新容器尺寸
 */

import Scrollbar from "../Scrollbar";
import "./index.less";

/**
 * @var 为实现平滑滚动而补足的数据项数量
 */
const DISPLAY_DSURPLUS = 3;

interface IListViewOptions<T> {
  /**
   * @member 容器的标签
   */
  tagName: keyof HTMLElementTagNameMap;
  /**
   * @member 容器的 class
   */
  className: string;
  /**
   * @member 滚动条是否可隐藏
   */
  suppressible: boolean;
  /**
   * @member 数据项高度
   */
  itemHeight: number;
  /**
   * @member 节点创建函数
   */
  createHandler(): HTMLElement;
  /**
   * @member 节点渲染函数
   */
  renderHandler(node: HTMLElement, data: T, index: number, ...args: any[]): void;
  /**
   * @member 点击事件
   */
  clickHandler(event: MouseEvent): void;
}

export default class ListView<T> {
  /**
   * @description 挂载的节点
   */
  private readonly root!: HTMLElement;

  /**
   * @description 容器的节点
   */
  private readonly container!: HTMLElement;

  /**
   * @description 撑开容器的元素
   */
  private readonly runway!: HTMLDivElement;

  /**
   * @description 滚动条
   */
  private readonly scrollbar!: Scrollbar;

  /**
   * @description 滚动条的高度
   * @deprecated 合并进 scrollbar
   */
  private get scrollbarHeight() {
    return this.cachedValue.containerHeight ** 2 / this.actualHeight;
  }

  /**
   * @description  缓存尺寸以减少 DOM 渲染
   */
  private readonly cachedValue = {
    /**
     * @description 容器尺寸
     */
    containerHeight: 0,
    containerWidth: 0,
    /**
     * @description 占位区块的尺寸
     */
    runwayHeight: 0,
    runwayWidth: 0,
    /**
     * @description 已滚动距离
     */
    scrolledX: 0,
    scrolledY: 0,
    /**
     * @description 滚动条宽度
     */
    scrollbarWidth: 0,
  };

  /**
   * @description 实际数据
   */
  private sourceList: Array<T> = [];

  /**
   * @description 根据已滚动高度和节点高度计算视口起始下标
   */
  private get startIndex() {
    return Math.floor(this.cachedValue.scrolledY / this.options.itemHeight);
  }

  /**
   * @description 视口待展示的数据量
   */
  private get virtualCount() {
    return Math.ceil(this.cachedValue.containerHeight / this.options.itemHeight) + DISPLAY_DSURPLUS;
  }

  /**
   * @description 内容的实际高度
   */
  private get actualHeight() {
    return this.sourceList.length * this.options.itemHeight;
  }

  /**
   * @description 配置项
   */
  private options!: IListViewOptions<T>;

  constructor(root: HTMLElement, options?: Partial<IListViewOptions<T>>) {
    this.options = {
      tagName: "ul",
      className: "",
      suppressible: true,
      itemHeight: 24,
      createHandler: () => document.createElement(tagName),
      renderHandler: () => {},
      clickHandler: () => {},
      ...options,
    };
    const { tagName, className } = this.options;
    this.root = root;
    this.scrollbar = new Scrollbar(this.root);
    this.container = document.createElement(tagName);
    this.container.className = `unitext-listview ${className}`;

    this.runway = document.createElement("div");
    this.runway.className = "listview-runway";
    this.container.appendChild(this.runway);
  }

  /**
   * @description 开始监听
   */
  public invoke() {
    this.root.appendChild(this.container);
    this.scrollbar.invoke();
    this.container.addEventListener("scroll", this.onScroll.bind(this));
    this.container.addEventListener("click", this.options.clickHandler.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  /**
   * @description 清理函数
   */
  public dispose(): void {
    window.removeEventListener("resize", this.onResize);
    this.container.removeEventListener("scroll", this.onScroll);
    this.container.removeEventListener("click", this.options.clickHandler);
    this.scrollbar.dispose();
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
    // 处理越界行为

    // 添加数据
    this.sourceList.push(...dataList);

    // 处理视口内的更新
  }

  /**
   * @description 全量更新数据
   *
   * - 只渲染视口内数据，成本较低
   *
   * @param dataList 新数据域
   */
  public updateData(dataList: Array<T>): void {
    this.sourceList = [];
    this.sourceList.push(...dataList);

    this.onResize();

    // 更新 DOM
    const { virtualCount } = this;
    const nodes = [];
    for (let index = 0; index < virtualCount; index++) {
      nodes.push(this.options.createHandler());
    }
    this.container.append(...nodes);

    if (true) {
      // 动态计算 runway 尺寸
      this.cachedValue.runwayHeight = this.runway.clientHeight;
      this.cachedValue.runwayWidth = this.runway.clientWidth;
    }

    // 撑开容器
    const x = 0;
    const y = this.actualHeight - this.cachedValue.runwayHeight;
    this.runway.style.transform = `translate(${x}px, ${y}px)`;

    this._renderList();
  }

  /**
   * @description 手动更新容器尺寸
   *
   * - 对外暴露的方法
   */
  public resize(): void {
    this.onResize();
  }

  /**
   * @description 渲染函数
   */
  private _renderList(): void {
    // 偏移列表
    const { virtualCount, startIndex, cachedValue } = this;
    const { itemHeight } = this.options;
    const scrolledTop = cachedValue.scrolledY;
    const offset = scrolledTop % itemHeight;

    // 渲染视口数据
    const actualList = this.container.children;
    const virtualList = this.sourceList.slice(startIndex, startIndex + virtualCount);

    for (let index = 0; index < virtualCount; index++) {
      const x = 0;
      const y = scrolledTop + index * itemHeight - offset;
      (actualList[index + 1] as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
    }

    for (let index = 0; index < virtualCount; index++) {
      const node = actualList[index + 1] as HTMLElement;
      const data = virtualList[index];
      this.options.renderHandler(node, data, index);
    }
  }

  /**
   * @description 滚动后的回调函数
   */
  private onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const { scrollTop } = target;

    // console.log(event);

    // 越界操作
    if (
      scrollTop < 0 ||
      scrollTop + this.cachedValue.containerHeight + DISPLAY_DSURPLUS * this.options.itemHeight > this.actualHeight
    ) {
      console.log("end", scrollTop, this.cachedValue.containerHeight, this.actualHeight);
      return;
    }

    this.cachedValue.scrolledY = scrollTop;
    this._renderList();
  }

  /**
   * @description 缩放后的回调函数
   */
  private onResize(): void {
    this.cachedValue.containerHeight = this.container.offsetHeight;
    this.cachedValue.containerWidth = this.container.offsetWidth;

    // 只有滚动高度和起始位置是不变的
    // 滚动时动态渲染视口数据
    // 因此只需要在边界修补数据
  }
}
