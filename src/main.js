import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/styles/main.css";

//import { createApp } from "vue";
import { createSSRApp } from "vue";
import App from "./App.vue";
//import router from "./router";
import { createRouter } from "./router";

import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';
/* import "@primevue/themes/saga-blue/theme.css";
import "primevue/resources/primevue.css";
import "primeicons/primeicons.css"; */

import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/* const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: false,
      cssLayer: false
    }
  }
});

router.afterEach((to) => {
  document.title = "Movie Explorer | " + (to.meta.title || "Home");
});

app.use(router).mount("#app"); */

export function createApp() {
  const app = createSSRApp(App);

  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: false,
        cssLayer: false
      }
    }
  });

  const router = createRouter();

  router.afterEach((to) => {
    document.title = "Movie Explorer | " + (to.meta.title || "Home");
  });

  //app.use(router).mount("#app");

  app.use(router);
  return { app, router };
}
