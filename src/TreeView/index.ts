import ListView, { IListViewOptions } from "../ListView";
import { ITreeNodeFolder, TreeNodeFile, TreeNodeFolder } from "./TreeModel";
import "./index.less";

type TreeNode = TreeNodeFile | TreeNodeFolder;

interface ITreeViewOptions<T> extends Partial<IListViewOptions<T>> {
  /**
   * @member 数据源
   */
  initData?: ITreeNodeFolder;
  showIndent?: boolean;

  onOpen: Function;
  onMove?: Function;
  onDelete?: Function;
  onContext: Function;
}

export default class TreeView {
  /**
   * @description 根节点
   */
  private readonly root!: HTMLElement;

  /**
   * @field 数据模型
   */
  private readonly treeModel!: TreeNodeFolder | null;

  /**
   * @field 需要渲染的项目列表，包含文件/文件夹
   */
  private readonly nodeList!: Array<TreeNode>;

  /**
   * @field 渲染呈现
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

  constructor(root: HTMLElement, data: ITreeNodeFolder, options: ITreeViewOptions<TreeNode>) {
    this.root = root;
    this.root.className = `unitext-treeview`;
    this.options = options;

    this.treeModel = new TreeNodeFolder(data, null);

    this.nodeList = this._getNodeList(this.treeModel);
    this.listView = new ListView(root, {
      // 透传
      ...options,
    });
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
        if (!this.nodeList[index].collapsible) {
          this.options.onOpen();
        }

        if ((this.nodeList[index] as TreeNodeFolder).collapsed) {
          this._setExpend(index);
        } else {
          this._setCollpase(index);
        }

        this._render();
        this.options.clickHandler && this.options.clickHandler(event);
      },

      /**
       * @description 双击
       */
      dbclick: (): void => {},

      /**
       * @description 右键
       * @param idx 序号
       */
      contextmenu: (idx: number): void => {
        this.options.onContext(this.nodeList[idx].getAncestorNode());
      },

      keydown: (idx: number): void => {
        // rename
      },
    };

    for (const eventName in EVENT_MAP) {
      this.root.addEventListener(eventName, (event) => {
        const target = event.target as HTMLElement;
        if (["DIV", "I"].includes(target.nodeName)) {
          const index = Number.parseInt(target.parentElement!.className);
          EVENT_MAP[eventName].call(this, index, event);
        }
      });
    }

    this._render();
  }

  /**
   * @description 清理函数
   */
  public dispose(): void {}

  /**
   * @description 更新配置
   */
  public updateOptions(): void {}

  /**
   * @description 收起所有文件
   * @param isAll 是否递归收拢
   */
  public toggleAll(isAll: boolean): void {}

  private _setExpend(idx: number): void {
    const target = this.nodeList[idx] as TreeNodeFolder;
    target.setCollapsible(false);
    this.nodeList.splice(idx + 1, 0, ...this._getNodeList(target));
  }

  private _setCollpase(idx: number): void {
    const target = this.nodeList[idx] as TreeNodeFolder;
    target.setCollapsible(true);
    this.nodeList.splice(idx + 1, this._getNodeList(target).length);
  }

  /**
   * @description 获取列表
   * @param model 模型
   */
  private _getNodeList(model: TreeNodeFolder): Array<TreeNode> {
    const list: Array<TreeNode> = [];

    // TODO 顺序

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
