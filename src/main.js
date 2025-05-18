import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";

import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

app.use(PrimeVue);

router.afterEach((to) => {
  document.title = "Movie Explorer | " + (to.meta.title || "Home");
});

app.use(router).mount("#app");
