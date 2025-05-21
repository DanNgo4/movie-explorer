// src/entry-server.js
import { createApp } from './main.js';
import { renderToString } from 'vue/server-renderer';

export async function render(url) {
  const { app, router } = createApp();
  // Navigate to the desired route
  router.push(url);
  await router.isReady();
  // Render the app to HTML
  const appHtml = await renderToString(app);
  return appHtml;
}
