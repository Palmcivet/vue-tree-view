import { TreeView } from "../../src/TreeView";
import "../../src/TreeView/index.less";
import "./theme.less";

export default async (context: ThisType<Window>) => {
  const TreeData = await (await fetch("data/tree-level-1.json")).json();

  const TreeViewInstance = new TreeView(
    document.getElementById("treeview-ref")!,
    {
      fetchHandler: async () => {
        return await (await fetch("data/tree-level-1.json")).json();
      },
      listView: {
        createHandler: () => {
          const node = document.createElement("li");
          node.className = "unitext-treeview__item";
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
          node.children[3].innerHTML = data.label;
        },
      },
    },
    TreeData
  );

  const onClick = (event: Event) => {
    console.info(event);
  };

  const onContextMenu = (event: Event) => {
    console.info(event);
  };

  TreeViewInstance.on("click", onClick);
  TreeViewInstance.on("contextmenu", onContextMenu);
  TreeViewInstance.invoke();

  document.getElementById("treeview-close")?.addEventListener("click", () => {
    TreeViewInstance.toggleAll(false);
  });

  document.getElementById("treeview-close-all")?.addEventListener("click", () => {
    TreeViewInstance.toggleAll(true);
  });

  (context as any).TreeViewInstance = TreeViewInstance;
};
