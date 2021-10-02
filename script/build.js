const fs = require("fs");
const path = require("path");
const less = require("less");
const { execSync } = require("child_process");

function compileLess(input, output) {
  return new Promise((resolve, reject) => {
    fs.readFile(input, (error, data) => {
      if (error) reject(error);

      const raw = data.toString();
      less.render(raw).then((res) => {
        fs.writeFile(output, res.css, {}, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
  });
}

function buildLess(input, output) {
  const sub = fs.readdirSync(input);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }

  sub.map((child) => {
    const inDir = path.join(input, child);

    if (fs.statSync(inDir).isDirectory()) {
      const outDir = path.join(output, child);
      buildLess(inDir, outDir);
    } else {
      if (child.endsWith(".less")) {
        const outDir = path.join(output, child.replace(".less", ".css"));
        compileLess(inDir, outDir).catch((err) => {
          console.log("Less build failed: ", err);
        });
      }
    }
  });
}

const INPUT = path.resolve(__dirname, "../src");
const OUTPUT = path.resolve(__dirname, "../dist");
const EXEC = /yarn\.js$/.test(process.env.npm_execpath) ? "yarn" : "npm";

if (fs.existsSync(OUTPUT)) {
  execSync(`rm -r ${OUTPUT}`);
}

execSync(`${EXEC} tsc --module commonjs --outDir dist/cjs/`);
execSync(`${EXEC} tsc --module esnext --outDir dist/esm/`);

buildLess(INPUT, path.join(OUTPUT, "cjs"));
buildLess(INPUT, path.join(OUTPUT, "esm"));
