/**
 * @interface 节点基本信息
 */
export interface ITreeNodeBase {
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
   * @field 是否可折叠
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
   * @field 是否已折叠
   */
  collapsed: boolean;
  /**
   * @field 是否已加载
   */
  loaded: boolean;
  /**
   * @field 文件节点
   */
  files: Array<ITreeNodeBase>;
  /**
   * @field 文件夹节点
   */
  folders: Array<ITreeNodeFolder>;
}
