import { ListView, IListViewOptions } from "../ListView";
import { TreeNodeFile, TreeNodeFolder } from "./TreeModel";
import { ITreeNodeFolder } from "./interface";
import EventBus from "../EventBus";

type TreeNode = TreeNodeFile | TreeNodeFolder;

const DEFAULT = {
  label: "",
  icon: "",
  collapsible: true,
  collapsed: true,
  loaded: false,
  files: [],
  folders: [],
};

export interface ITreeViewOptions<T> {
  /**
   * @description 展示缩进线
   */
  showIndent: boolean;
  /**
   * @description 自定义容器的类名
   */
  className: string;
  /**
   * @description 透传 ListView 的配置项
   */
  listView: Partial<IListViewOptions<T>>;

  /* 以下为逻辑事件处理函数 */

  /**
   * @description 获取文件
   */
  fetchHandler(...event: Array<any>): Promise<ITreeNodeFolder>;
}

export type EventType = "click" | "contextmenu" | "u-move" | "u-delete";

export class TreeView extends EventBus<EventType> {
  /**
   * @description 根节点
   */
  private readonly root!: HTMLElement;

  /**
   * @field 树的数据模型
   */
  private readonly treeModel!: TreeNodeFolder | null;

  /**
   * @field 需要渲染的项目列表，包含文件/文件夹
   */
  private readonly nodeList: Array<TreeNode> = [];

  /**
   * @field 渲染列表的容器
   */
  private readonly listView!: ListView<TreeNode>;

  /**
   * @field 当前焦点
   */
  private activeNode!: TreeNode | null;

  /**
   * @field 设置
   */
  private readonly options!: ITreeViewOptions<TreeNode>;

  constructor(root: HTMLElement, data: ITreeNodeFolder = DEFAULT, options?: Partial<ITreeViewOptions<TreeNode>>) {
    super();

    this.options = {
      showIndent: true,
      className: "",
      listView: {},
      fetchHandler: async () => DEFAULT,
      ...options,
    };

    const { className, listView } = this.options;
    this.root = root;
    this.root.className = `unitext-treeview ${className}`;
    this.treeModel = new TreeNodeFolder(data, null);
    this.listView = new ListView(root, { ...listView });
    this.nodeList = this._getNodeList(this.treeModel);
  }

  /**
   * @description 开始监听
   */
  public invoke(): void {
    this.listView.invoke();

    const EVENT_MAP: { [K: string]: Function } = {
      /**
       * @description 点击事件
       * @param index 序号
       */
      click: (index: number, event: MouseEvent): void => {
        const targetNode = this.nodeList[index];
        this.activeNode = targetNode;

        if (targetNode.collapsible) {
          this._toggleCollpase(index, !(targetNode as TreeNodeFolder).collapsed);
        }

        this.emit("click", event);
      },

      /**
       * @description 双击
       */
      dbclick: (): void => {},

      /**
       * @description 右键
       * @param index 序号
       */
      contextmenu: (index: number): void => {
        this.emit("contextmenu", this.nodeList[index].getAncestorNode());
      },

      keydown: (idx: number): void => {
        // rename
      },
    };

    for (const eventName in EVENT_MAP) {
      this.root.addEventListener(eventName, (event) => {
        const target = event.target as HTMLElement;
        if (["DIV", "I"].includes(target.nodeName)) {
          const index = Number.parseInt(target.parentElement!.dataset.index!);
          EVENT_MAP[eventName].call(this, index, event);
        }
      });
    }

    this._render();
  }

  /**
   * @description 清理函数
   */
  public dispose(): void {
    this.listView.dispose();
    for (let index = 0; index < this.root.children.length; index++) {
      this.root.removeChild(this.root.children[index]);
    }
  }

  /**
   * @description 更新配置
   */
  public updateOptions(): void {}

  /**
   * @description 收起所有文件
   * @param isAll 是否递归收拢
   */
  public toggleAll(isAll: boolean): void {}

  /**
   * @description 开关文件夹
   * @param index 下标
   * @param status 是否折叠
   */
  private async _toggleCollpase(index: number, status: boolean): Promise<void> {
    const target = this.nodeList[index] as TreeNodeFolder;

    if (status) {
      target.setCollapsible(true);
      this.nodeList.splice(index + 1, this._getNodeList(target).length);
    } else {
      target.setCollapsible(false);
      this.listView.renderItem(target, index);
      if (!target.getLoadStatus()) {
        const data = await this.options.fetchHandler();
        target.loadFolder(data);
      }
      this.nodeList.splice(index + 1, 0, ...this._getNodeList(target));
    }

    this._render();
  }

  /**
   * @description 获取列表
   * @param model 模型
   */
  private _getNodeList(model: TreeNodeFolder): Array<TreeNode> {
    const list: Array<TreeNode> = [];

    // TODO 顺序

    // TODO 封装，从 get- 接口获取
    model.folders.forEach((item) => {
      list.push(item);
      if (!item.collapsed) {
        list.push(...this._getNodeList(item));
      }
    });

    model.files.forEach((item) => {
      list.push(item);
    });

    return list;
  }

  /**
   * @description 渲染函数
   */
  private _render() {
    this.listView.updateData(this.nodeList);
  }
}
