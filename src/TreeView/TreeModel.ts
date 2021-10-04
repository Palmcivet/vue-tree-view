import { ITreeNodeBase, ITreeNodeFile, ITreeNodeFolder } from "./interface";

/**
 * @description 实现文件节点
 */
export class TreeNodeFile implements ITreeNodeFile {
  label!: string;

  collapsible!: boolean;

  parentNode!: TreeNodeFolder | null;

  constructor(data: ITreeNodeBase, parent: TreeNodeFolder | null) {
    this.label = data.label;
    this.collapsible = data.collapsible;
    this.parentNode = parent;
  }

  /**
   * @description 递归获取祖先节点
   */
  getAncestorNode(): TreeNodeFolder | null {
    if (this.parentNode !== null) {
      return this.parentNode.getAncestorNode();
    } else {
      return this.parentNode;
    }
  }

  /**
   * @description 递归获取节点路径
   */
  getNodePath(): Array<string> {
    if (this.parentNode) {
      return this.parentNode.getNodePath().concat(this.label);
    } else {
      return [this.label];
    }
  }

  /**
   * @description 获取层级
   * @param level 父级缩进层级
   */
  getNodeIndent(level: number): number {
    if (this.parentNode !== null) {
      return this.parentNode.getNodeIndent(level + 1);
    } else {
      return level;
    }
  }

  /**
   * @description 修改节点标签
   * @param label 新的标签
   */
  setNodeLabel(label: string): void {
    this.label = label;
  }

  /**
   * @description 查找节点
   */
  revealNode(): void {}
}

/**
 * @description 实现文件树节点
 */
export class TreeNodeFolder extends TreeNodeFile implements ITreeNodeFolder {
  loaded!: boolean;

  collapsed!: boolean;

  readonly folders: Array<TreeNodeFolder> = [];

  readonly files: Array<TreeNodeFile> = [];

  constructor(data: ITreeNodeFolder, parent: TreeNodeFolder | null) {
    super(data, parent);
    this.loaded = data.loaded;
    this.collapsed = data.collapsed;
    this._initModel(data);
  }

  /**
   * @description 初始化文件夹
   * @param data 传入的文件夹数据
   */
  private _initModel(data: ITreeNodeFolder): void {
    data.folders.forEach((item) => {
      this.folders.push(new TreeNodeFolder(item, this));
    });

    data.files.forEach((item) => {
      this.files.push(new TreeNodeFile(item, this));
    });
  }

  /**
   * @description 获取文件夹下的子文件
   */
  getFiles(): Array<TreeNodeFile> {
    return this.files;
  }

  /**
   * @returns
   */
  getLoadStatus(): boolean {
    return this.loaded;
  }

  /**
   * @description 获取文件夹下的子文件夹
   */
  getFolders(): Array<TreeNodeFolder> {
    return this.folders;
  }

  /**
   * @description 异步加载数据
   * @param model 传入的数据
   */
  loadFolder(model: ITreeNodeFolder): void {
    this._initModel(model);
    this.loaded = true;
  }

  /**
   * @param status 折叠状态。`true` 折叠；`false` 展开
   */
  setCollapsible(status: boolean): void {
    this.collapsed = status;
  }
}
