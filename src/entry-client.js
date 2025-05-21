// src/entry-client.js
import { createApp } from './main.js';

const { app, router } = createApp();
// Wait until router has resolved initial route (in case using async routes)
router.isReady().then(() => {
  app.mount('#app');
});
