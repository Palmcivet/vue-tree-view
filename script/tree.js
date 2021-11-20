const fs = require("fs");
const path = require("path");

function collect(location) {
  const sub = fs.readdirSync(location);

  const files = [];

  const folders = [];

  sub.map((child) => {
    const dir = path.join(location, child);
    if (fs.statSync(dir).isDirectory()) {
      folders.push(collect(dir));
    } else {
      files.push({
        label: path.basename(dir),
        icon: "ri-markdown-line",
        collapsible: false,
      });
    }
  });

  return {
    label: path.basename(location),
    icon: "ri-folder-2-line",
    collapsible: true,
    collapsed: true,
    files,
    folders,
  };
}

console.log(JSON.stringify(collect(process.cwd())));
