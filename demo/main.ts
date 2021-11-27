import Monitor from "./src/monitor";
import ListViewDemo from "./src/list";
import TreeViewDemo from "./src/tree";
import SplitViewDemo from "./src/split";
import "./src/theme.less";
import "./style.less";

((context: ThisType<Window>) => {
  const DEMO_LIST: Array<HTMLElement> = [];
  const NAV_LIST: Array<HTMLElement> = [];

  let active = 3;
  const toggleActive = (index: number, flag: boolean) => {
    if (flag) {
      NAV_LIST[index].classList.add("active");
      DEMO_LIST[index].classList.add("active");
    } else {
      NAV_LIST[index].classList.remove("active");
      DEMO_LIST[index].classList.remove("active");
    }
  };

  const navbar = document.querySelector(".navbar");
  document.querySelectorAll(".container > .demo").forEach((element, index) => {
    DEMO_LIST.push(element as HTMLElement);
    const li = document.createElement("li");
    li.innerText = element.querySelector("h2").innerHTML;
    li.dataset.index = index.toString();
    NAV_LIST.push(li);
    navbar.appendChild(li);
  });

  navbar.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.nodeName !== "LI") return;
    const index = Number.parseInt(target.dataset.index);
    toggleActive(active, false);
    active = index;
    toggleActive(index, true);
  });

  toggleActive(active, true);

  Monitor(document.getElementById("monitor") as HTMLCanvasElement);
  ListViewDemo(context);
  TreeViewDemo(context);
  SplitViewDemo(context);
})(window);
