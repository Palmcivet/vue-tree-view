import { ListView, IListViewOptions } from "../ListView";
import { TreeNodeFile, TreeNodeFolder } from "./treeModel";
import { ITreeNodeFolder } from "./interface";
import EventBus from "../EventBus";
import { prefix } from "../config";
import "./index.less";

type TreeNode = TreeNodeFile | TreeNodeFolder;

const DEFAULT_MODEL = {
  label: "",
  icon: "",
  collapsible: true,
  collapsed: true,
  loaded: false,
  files: [],
  folders: [],
};

const CLASS_NAME = {
  Root: "unitext-treeview",
  DragSource: `${prefix}-tree__drag-source`,
  DragTarget: `${prefix}-tree__drag-target`,
};

export type EventType = "click" | "contextmenu" | "u-open" | "u-move" | "u-delete" | "u-rename";

export interface ITreeViewOptions<T> {
  /**
   * @description 展示缩进线
   */
  showIndent: boolean;
  /**
   * @description 透传 ListView 的配置项
   */
  listView: Partial<IListViewOptions<T>>;
  /**
   * @description 获取文件
   */
  fetchHandler(...event: Array<any>): Promise<ITreeNodeFolder>;
}

export class TreeView extends EventBus<EventType> {
  /**
   * @field 根节点
   */
  private readonly root: HTMLElement;

  /**
   * @field 树的数据模型
   */
  private readonly treeModel: TreeNodeFolder;

  /**
   * @field 渲染列表的容器
   */
  private readonly listView: ListView<TreeNode>;

  /**
   * @field 需要渲染的项目列表，包含文件/文件夹
   */
  private readonly treeNodeList: Array<TreeNode> = [];

  /**
   * @field 当前焦点
   */
  private activeTreeNode!: TreeNode | null;

  /**
   * @field 设置
   */
  private readonly options!: ITreeViewOptions<TreeNode>;

  constructor(root: HTMLElement, options?: Partial<ITreeViewOptions<TreeNode>>, data: ITreeNodeFolder = DEFAULT_MODEL) {
    super();

    this.options = {
      showIndent: true,
      listView: {
        createHandler: this._createTreeNodeElement,
        renderHandler: this._renderTreeNodeElement,
      },
      fetchHandler: async () => DEFAULT_MODEL,
      ...options,
    };

    const { listView } = this.options;
    this.root = root;
    this.root.classList.add(CLASS_NAME.Root);
    this.treeModel = new TreeNodeFolder(data, null);
    this.listView = new ListView(root, { ...listView });
    this.treeNodeList = [];
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
        const targetTreeNode = this.treeNodeList[index];
        this.activeTreeNode = targetTreeNode;

        if (targetTreeNode.collapsible) {
          this._toggleCollpase(index, !(targetTreeNode as TreeNodeFolder).collapsed);
        } else {
          this.emit("u-open", targetTreeNode.getNodePath());
        }

        this.emit("click", targetTreeNode);
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
        this.emit("contextmenu", this.treeNodeList[index].getAncestorNode());
      },

      keydown: (idx: number): void => {
        // rename
        // search
      },

      /* 拖拽元素 */

      dragstart: (index: number, event: DragEvent): boolean => {
        console.log("dragstart", index);

        if (event.dataTransfer === null) {
          return false;
        }

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text", index.toString());

        const target = event.target as HTMLElement;
        target.classList.add(CLASS_NAME.DragSource);

        return true;
      },

      drag: (index: number, event: DragEvent): boolean => {
        event.preventDefault();
        return false;
      },

      dragend: (index: number, event: DragEvent): void => {
        console.log("dragend");

        const target = event.target as HTMLElement;
        target.classList.remove(CLASS_NAME.DragSource);
      },

      /* 目标元素 */

      dragenter: (index: number, event: DragEvent): void => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        target.classList.add(CLASS_NAME.DragTarget);
      },

      dragover: (index: number, event: DragEvent): boolean => {
        event.preventDefault();
        return false;
      },

      dragleave: (index: number, event: DragEvent): void => {
        console.log("leave");

        const target = event.target as HTMLElement;
        target.classList.remove(CLASS_NAME.DragTarget);
      },

      drogexit: (index: number, event: DragEvent): void => {
        console.log("dropexit");
      },

      drop: (index: number, event: DragEvent): void => {
        console.log("drop");
        const target = event.target as HTMLElement;
        target.classList.remove(CLASS_NAME.DragTarget);

        const dstIndex = Number.parseInt(event.dataTransfer?.getData("text")!);
        const srcNode = this.treeNodeList[index];
        const dstNode = this.treeNodeList[dstIndex];
        this.treeNodeList[index] = dstNode;
        this.treeNodeList[dstIndex] = srcNode;
        this._renderTree();
      },
    };

    for (const eventName in EVENT_MAP) {
      this.root.addEventListener(eventName, (event) => {
        const target = event.target as HTMLElement;
        const index = Number.parseInt(target.dataset.index!);
        EVENT_MAP[eventName].call(this, index, event);
      });
    }

    this._updateTreeNodeList();
    this._renderTree();
  }

  /**
   * @description 清理函数
   */
  public dispose(): void {
    this.listView.dispose();
    this.root.classList.remove(CLASS_NAME.Root);
    for (let index = 0; index < this.root.children.length; index++) {
      this.root.removeChild(this.root.children[index]);
    }
  }

  /**
   * @description 更新配置
   */
  public updateOptions(): void {}

  /**
   * @description 更新文件夹
   */
  public updateData(dataModel: TreeNodeFolder): void {
    this.treeModel?.loadModel(dataModel);
    this._updateTreeNodeList();
    this._renderTree();
  }

  /**
   * @description 收起所有文件
   * @param isAll 是否递归收拢
   */
  public toggleCollpaseAll(isAll: boolean = false): void {
    const walkThrough = (model: TreeNodeFolder, flag = true) => {
      model.folders.forEach((subModel) => {
        subModel.setCollapsible(true);
        if (flag) {
          walkThrough(subModel);
        }
      });
    };

    walkThrough(this.treeModel!, isAll);

    this._updateTreeNodeList();
    this._renderTree();
  }

  /**
   * @description 开关文件夹
   * @param index 下标
   * @param status 是否折叠
   */
  private async _toggleCollpase(index: number, status: boolean): Promise<void> {
    const target = this.treeNodeList[index] as TreeNodeFolder;

    if (status) {
      target.setCollapsible(true);
      this.treeNodeList.splice(index + 1, this._getTreeNodeList(target).length);
    } else {
      target.setCollapsible(false);
      this.listView.renderListItem(target, index);
      if (!target.getLoadStatus()) {
        const data = await this.options.fetchHandler();
        target.loadModel(data);
      }
      this.treeNodeList.splice(index + 1, 0, ...this._getTreeNodeList(target));
    }

    this._renderTree();
  }

  /**
   * @function 纯函数
   * @description 获取部分 treeNodeList 列表
   * @param model 模型
   */
  private _getTreeNodeList(model: TreeNodeFolder): Array<TreeNode> {
    const list: Array<TreeNode> = [];

    // TODO 顺序

    model.folders.forEach((item) => {
      list.push(item);
      if (!item.collapsed) {
        list.push(...this._getTreeNodeList(item));
      }
    });

    model.files.forEach((item) => {
      list.push(item);
    });

    return list;
  }

  /**
   * @description 全量更新 treeNodeList
   */
  private _updateTreeNodeList(): void {
    const { length } = this.treeNodeList;
    this.treeNodeList.splice(0, length, ...this._getTreeNodeList(this.treeModel));
  }

  /**
   * @function 纯函数
   * @description 创建元素节点
   * @returns 树列表元素节点
   */
  private _createTreeNodeElement(): HTMLElement {
    const element = document.createElement("li");
    element.innerHTML = `
<div class="${prefix}-indent"></div>
<i class="${prefix}-twist"></i>
<i class="${prefix}-icon"></i>
<div class="${prefix}-label"></div>`;
    return element;
  }

  /**
   * @description 渲染树列表元素节点
   * @param element 元素节点
   * @param data 待渲染的数据
   * @param index 待渲染的数据逻辑索引
   */
  private _renderTreeNodeElement(element: HTMLElement, data: TreeNode, index: number) {
    const indent = data.getNodeIndent(-1);
    element.title = data.label;
    element.children[0].innerHTML = "<div></div>".repeat(indent);

    if (data.collapsible) {
      const collapsed = (data as any).collapsed;
      element.children[1].className = collapsed ? "ri-arrow-right-s-line" : "ri-arrow-down-s-line";
      element.children[2].className = collapsed ? "ri-folder-2-line" : "ri-folder-open-line";
      // FEAT icon
    } else {
      element.children[1].className = "";
      element.children[2].className = "ri-markdown-line"; // FEAT icon
    }
    element.children[3].innerHTML = data.label;
  }

  /**
   * @description 渲染函数
   */
  private _renderTree(): void {
    this.listView.updateData(this.treeNodeList);
  }
}
