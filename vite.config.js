import { defineConfig } from "vite";
import { resolve } from "path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  server: {
    port: 30000,
  },
  build: {
    emptyOutDir: true,
    lib: {
      formats: ["es", "cjs"],
      entry: resolve(__dirname, "src/index.ts"),
      name: "UniTextTreeView",
      fileName: "index",
    },
  },
  plugins: [typescript()],
});
