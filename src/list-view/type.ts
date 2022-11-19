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
