import Monitor from "./src/monitor";
import ListViewDemo from "./src/list";
import TreeViewDemo from "./src/tree";
import "./style.less";

((context: ThisType<Window>) => {
  Monitor(document.getElementById("monitor") as HTMLCanvasElement);
  ListViewDemo(context);
  TreeViewDemo(context);
})(window);
