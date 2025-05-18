import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

import { BASE_URL } from "./src/assets/baseUrl";

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
  base: BASE_URL,
});
