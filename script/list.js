const fs = require("fs");

function collect(location) {
  const itemList = fs.readdirSync(location);
  return itemList;
}

console.log(collect(process.cwd()));
