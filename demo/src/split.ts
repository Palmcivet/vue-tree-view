import { SplitView } from "../../src/SplitView";

export default async (context: ThisType<Window>) => {
  const SplitViewInstance = new SplitView(document.getElementById("splitview-ref")!);
  SplitViewInstance.invoke();

  const selectColor = () => {
    const color = [
      "#F53F3F",
      "#F77234",
      "#FF7D00",
      "#F7BA1E",
      "#FADC19",
      "#9FDB1D",
      "#00B42A",
      "#14C9C9",
      "#3491FA",
      "#165DFF",
      "#722ED1",
      "#D91AD9",
      "#F5319D",
    ];
    const index = Math.floor(Math.random() * color.length);
    return color[index];
  };

  let index = 1;

  const first = document.createElement("div");
  first.style.backgroundColor = selectColor();
  first.innerHTML = `<div>${index}. 200 ~ 400</div>`;
  SplitViewInstance.addView({
    element: first,
    initialSize: 200 + index * 10,
    minimumSize: 200,
    maximumSize: 400,
    priority: -1,
  });

  index += 1;
  const second = document.createElement("div");
  second.style.backgroundColor = selectColor();
  second.innerHTML = `<div>${index}. 200 ~ </div>`;
  SplitViewInstance.addView({
    element: second,
    initialSize: 200 + index * 10,
    minimumSize: 200,
  });

  document.getElementById("splitview-add")?.addEventListener("click", () => {
    index += 1;
    const element = document.createElement("div");
    element.style.backgroundColor = selectColor();
    element.innerHTML = `<div>${index}. 200~</div>`;
    SplitViewInstance.addView({
      element,
      initialSize: 200 + index * 10,
      minimumSize: 200,
    });
  });

  document.getElementById("splitview-del")?.addEventListener("click", () => {
    SplitViewInstance.removeView();
  });

  (context as any).SplitViewInstance = SplitViewInstance;
};
