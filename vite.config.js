import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ssr from "vite-plugin-ssr/plugin";

export default defineConfig({
  plugins: [
    vue(),
    ssr()
  ],
  ssr: {
    noExternal: ['primevue']  // bundle PrimeVue for SSR to avoid ESM import issues
  },
  resolve: {
    alias: {
      "@": path.resolve("src/"),
    },
  },
  define: {
    __VUE_DEVTOOLS__: false,
  },
  base: "/cos30043/s104186810/project",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});
