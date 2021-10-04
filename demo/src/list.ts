import { ListView } from "../../src/ListView";
import "../../src/ListView/index.less";
import "./theme.less";

export default async (context: ThisType<Window>) => {
  const ListData = await (await fetch("/data/list.json")).json();

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
  ListViewInstance.invoke();
  ListViewInstance.updateData(ListData.slice(start, start + 20));

  document.getElementById("listview-add")?.addEventListener("click", () => {
    start += 10;
    ListViewInstance.insertData(ListData.slice(start, start + 10));
  });

  document.getElementById("listview-del")?.addEventListener("click", () => {
    console.log(start);
    const res = ListViewInstance.deleteData(start, 2);
    console.log(res);
  });

  (context as any).ListViewInstance = ListViewInstance;
};
