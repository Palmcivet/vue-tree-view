import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import pkg from "../package.json";

const homepage = pkg.homepage.split("/");

export default defineConfig({
  base: `/${homepage[homepage.length - 1]}/`,
  server: {
    port: 30000,
  },
  plugins: [vue()],
});
