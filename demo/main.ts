import Monitor from "./Monitor";
import ListView from "../src/ListView";
import ListData from "./data/list.json";
import "./style.less";
import "./theme.less";

((context: ThisType<Window>) => {
  Monitor(document.getElementById("monitor") as HTMLCanvasElement);

  const ListViewInstance = new ListView<string>(document.getElementById("listview-ref")!, {
    itemHeight: 24,
    fixedSize: false,
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

  let start = 0;
  (context as any).ListViewInstance = ListViewInstance;
  ListViewInstance.invoke();
  ListViewInstance.updateData(ListData.slice(start, start + 10));

  document.getElementById("listview-add")?.addEventListener("click", () => {
    start += 10;
    ListViewInstance.insertData(ListData.slice(start, start + 10));
  });
  document.getElementById("listview-del")?.addEventListener("click", () => {
    console.log(start);
    const res = ListViewInstance.deleteData(start, 2);
    console.log(res);
  });
})(window);
