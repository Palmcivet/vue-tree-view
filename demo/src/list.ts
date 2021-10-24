import { ListView } from "../../src/ListView";

export default async (context: ThisType<Window>) => {
  const ListData = await (await fetch("/data/list.json")).json();

  const ListViewInstance = new ListView<string>(document.getElementById("listview-ref")!, {
    itemHeight: 24,
    fixedSize: false,
    suppressible: true,
    createHandler: () => {
      const node = document.createElement("li");
      return node;
    },
    renderHandler: (node, data, index) => {
      node.title = data;
      node.innerText = data;
      node.dataset.index = `${index}`;
    },
  });

  const clickHandler = (event) => {
    console.info("click", event);
  };

  ListViewInstance.on("click", clickHandler);

  let start = 0;
  ListViewInstance.invoke();
  ListViewInstance.updateData(ListData.slice(start, start + 20));

  document.getElementById("listview-add")?.addEventListener("click", () => {
    start += 10;
    ListViewInstance.insertData(ListData.slice(start, start + 10));
  });

  document.getElementById("listview-del")?.addEventListener("click", () => {
    ListViewInstance.deleteData(start, 1);
  });

  (context as any).ListViewInstance = ListViewInstance;
};
