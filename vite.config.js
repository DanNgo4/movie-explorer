import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
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
