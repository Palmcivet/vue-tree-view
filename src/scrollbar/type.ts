export type Direction = "vertical" | "horizontal";

export interface IScrollbarOptions {
  /**
   * @member 是否悬浮
   */
  isLevitative: boolean;
  /**
   * @member 是否可隐藏
   */
  suppressible: boolean;
  /**
   * @member 滚动行为
   */
  scrollBehavior: "beisaier" | "smooth";
}
