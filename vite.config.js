import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": path.resolve("src/"),
    },
  },
  define: {
    __VUE_DEVTOOLS__: false,
  },
  base: "/cos30043/s104186810/project",
});
