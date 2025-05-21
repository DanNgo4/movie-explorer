import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";

import "./assets/styles/main.css";

import { createApp } from "./main";

const { app, router } = createApp();

router.isReady().then(() => app.mount("#app"));
