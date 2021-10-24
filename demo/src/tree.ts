import { TreeView } from "../../src/TreeView";

export default async (context: ThisType<Window>) => {
  const TreeData = await (await fetch("data/tree-level-1.json")).json();

  const TreeViewInstance = new TreeView(
    document.getElementById("treeview-ref")!,
    {
      fetchHandler: async () => {
        return await (await fetch("data/tree-level-1.json")).json();
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
    TreeViewInstance.toggleCollpaseAll(false);
  });

  document.getElementById("treeview-close-all")?.addEventListener("click", () => {
    TreeViewInstance.toggleCollpaseAll(true);
  });

  (context as any).TreeViewInstance = TreeViewInstance;
};
