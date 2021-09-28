import Monitor from "./Monitor";
import ListView from "../src/ListView";
import TreeView from "../src/TreeView";
import ListData from "./data/list.json";
import TreeData from "./data/tree.json";
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

  const TreeViewInstance = new TreeView(document.getElementById("treeview-ref")!, TreeData, {
    contextHandler: () => {},
    clickHandler: () => {},
    listView: {
      createHandler: () => {
        const node = document.createElement("li");
        node.innerHTML = `
<div class="indent"></div>
<i class="twist"></i>
<i class="icon"></i>
<div class="label"></div>`;
        return node;
      },
      renderHandler: (node, data, index) => {
        const indent = data.getNodeIndent(-1);
        node.title = data.label;
        node.className = index.toString();
        node.children[0].innerHTML = "<div></div>".repeat(indent);

        if (data.collapsible) {
          const collapsed = (data as any).collapsed;
          node.children[1].className = collapsed ? "ri-arrow-right-s-line" : "ri-arrow-down-s-line";
          node.children[2].className = collapsed ? "ri-folder-2-line" : "ri-folder-open-line";
          // FEAT icon
        } else {
          node.children[1].className = "";
          node.children[2].className = "ri-markdown-line"; // FEAT icon
        }
        node.children[3].innerHTML = indent + "-" + data.label;
      },
    },
  });
  TreeViewInstance.invoke();

  (context as any).TreeViewInstance = TreeViewInstance;
})(window);
