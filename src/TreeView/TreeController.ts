import { ITreeNodeFolder, TreeNodeFile, TreeNodeFolder } from "./TreeModel";
import TreeRenderer from "./TreeRenderer";

type TreeNodeList = Array<TreeNodeFile | TreeNodeFolder>;

interface IOptions {
  data: ITreeNodeFolder;
  indent: boolean;
  onOpen: Function;
  onMove: Function;
  onDelete: Function;
  onContext: Function;
}

export default class TreeViewModel {
  /**
   * @field 需要渲染的项目列表，包含文件/文件夹
   */
  nodeList!: TreeNodeList;

  /**
   * @field 数据模型
   */
  treeModel!: TreeNodeFolder | null;

  /**
   * @field 渲染呈现
   */
  renderer!: TreeRenderer;

  /**
   * @field 当前选中的文件
   */
  activeNode!: TreeNodeFile | TreeNodeFolder;

  options!: IOptions;

  constructor(el: HTMLElement, opt: IOptions) {
    this.options = opt;
    this.treeModel = new TreeNodeFolder(opt.data, null);
    this.nodeList = this.getNodeList(this.treeModel as TreeNodeFolder);
    this.renderer = new TreeRenderer(el, {
      click: this.onClick,
      keydown: this.onKeydown,
      context: this.onContext,
    });

    this.render();
  }

  private onClick = (idx: number) => {
    if (!this.nodeList[idx].collapsible) this.options.onOpen();

    if ((this.nodeList[idx] as TreeNodeFolder).collapsed) {
      this.setExpend(idx);
    } else {
      this.setCollpase(idx);
    }

    this.render();
  };

  private onKeydown = (idx: number) => {
    // rename
  };

  private onContext = (idx: number) => {
    this.options.onContext(this.nodeList[idx].getAncestorNode());
  };

  private getNodeList(node: TreeNodeFolder): TreeNodeList {
    const list: TreeNodeList = [];

    // TODO 顺序

    node.folders.forEach((item) => {
      list.push(item);
      if (!item.collapsed) {
        list.push(...this.getNodeList(item));
      }
    });

    node.files.forEach((item) => {
      list.push(item);
    });

    return list;
  }

  private setExpend(idx: number): void {
    const target = this.nodeList[idx] as TreeNodeFolder;
    target.setCollapsible(false);
    this.nodeList.splice(idx + 1, 0, ...this.getNodeList(target));
  }

  private setCollpase(idx: number): void {
    const target = this.nodeList[idx] as TreeNodeFolder;
    target.setCollapsible(true);
    this.nodeList.splice(idx + 1, this.getNodeList(target).length);
  }

  private render() {
    this.renderer.render(this.nodeList);
  }

  updateOptions() {}

  resizeHeight() {
    this.renderer.onResize();
  }

  toggleAll() {}
}
