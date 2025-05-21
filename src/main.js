import { createSSRApp } from "vue";
import { createHead } from "@vueuse/head";

import App from "./App.vue";

import { createRouter } from "./router";

import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';

// SSR requires a fresh app instance per request, therefore we export a function
export function createApp() {
  const app = createSSRApp(App);

  const head = createHead();
  app.use(head);

  const router = createRouter();
  app.use(router);

  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
        darkModeSelector: false,
        cssLayer: false
      }
    }
  });

  return { app, router, head };
}
