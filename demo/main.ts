import Monitor from "./Monitor";
import ListView from "../src/ListView";
import ListData from "./data/list.json";
import "./style.less";
import "./theme.less";

((context: ThisType<Window>) => {
  const instance = new ListView<string>(document.getElementById("listview-ref")!, {
    itemHeight: 24,
    suppressible: true,
    createHandler: () => {
      const node = document.createElement("li");
      node.innerHTML = `
<div class="indent"></div>
<i class="twist"></i>
<i class="icon"></i>
<div class="title"></div>`;
      return node;
    },
    renderHandler: (node, data, index) => {
      node.title = data;
      node.innerText = data;
      node.className = `${index}`;
    },
    clickHandler: (event) => {
      console.log("click", event);
    },
  });

  instance.invoke();
  instance.updateData(ListData);
  (context as any).listview = instance;

  Monitor(document.getElementById("monitor") as HTMLCanvasElement);
})(window);
