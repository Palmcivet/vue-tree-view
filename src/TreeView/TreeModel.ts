/* type define start */

/**
 * @interface 节点基本信息
 */
interface ITreeNodeBase {
  /**
   * @field 节点名称
   */
  label: string;
  /**
   * @field 图标
   */
  icon?: string;
  /**
   * @field 手动指定的顺序
   */
  order?: number;
  /**
   * @field 表示节点类型
   */
  collapsible: boolean;
}

/**
 * @interface 文件节点
 */
export interface ITreeNodeFile extends ITreeNodeBase {}

/**
 * @interface 文件夹节点
 */
export interface ITreeNodeFolder extends ITreeNodeBase {
  /**
   * @field 折叠状态
   */
  collapsed: boolean;
  /**
   * @field 文件节点
   */
  files: Array<ITreeNodeBase>;
  /**
   * @field 文件夹节点
   */
  folders: Array<ITreeNodeFolder>;
}

/* type define end */

import { SLASH } from "./constant";

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

  getAncestorNode(): TreeNodeFolder | null {
    if (this.parentNode !== null) {
      return this.parentNode.getAncestorNode();
    } else {
      return this.parentNode;
    }
  }

  getNodeIndent(level: number): number {
    if (this.parentNode !== null) {
      return this.parentNode.getNodeIndent(level + 1);
    } else {
      return level;
    }
  }

  getNodePath(): string {
    if (this.parentNode) {
      return `${this.parentNode.getNodePath()}${SLASH}${this.label}`;
    } else {
      return this.label;
    }
  }

  setNodeLabel(label: string): void {
    this.label = label;
  }

  revealNode(): void {}
}

/**
 * @description 实现文件树节点
 */
export class TreeNodeFolder extends TreeNodeFile implements ITreeNodeFolder {
  collapsed!: boolean;

  readonly files: Array<TreeNodeFile> = [];

  readonly folders: Array<TreeNodeFolder> = [];

  constructor(data: ITreeNodeFolder, parent: TreeNodeFolder | null) {
    super(data, parent);

    this.collapsed = data.collapsed;

    data.folders.forEach((item) => {
      this.folders.push(new TreeNodeFolder(item, this));
    });

    data.files.forEach((item) => {
      this.files.push(new TreeNodeFile(item, this));
    });
  }

  /**
   * @param status 折叠状态。`true` 折叠；`false` 展开
   */
  setCollapsible(status: boolean) {
    this.collapsed = status;
  }
}
