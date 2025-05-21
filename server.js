/* // server.js
import fs from "fs";
import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import { render } from "./src/entry-server.js";

async function start() {
  const app = express();

  // 1) Vite in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: "ssr" },
    appType: "custom"
  });
  app.use(vite.middlewares);

  // 2) Serve all routes
  app.use("*", async (req, res) => {
    try {
      // 2a) Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      // 2b) Apply Vite HTML transforms (HMR, asset handling)
      template = await vite.transformIndexHtml(req.url, template);

      // 2c) Render the app
      const { appHtml, initialState } = await render(req.url);

      // 2d) Inject the app HTML + initial state
      const html = template
        .replace(`<!--app-html-->`, appHtml)
        .replace(
          `<!--app-state-->`,
          `<script>window.__INITIAL_STATE__=${JSON.stringify(
            initialState
          )}</script>`
        );

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.stack);
    }
  });

  app.listen(3000, () => {
    console.log("SSR running at http://localhost:3000");
  });
}

start();
 */

// server.js (excerpt)
import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const baseDir = path.dirname(new URL(import.meta.url).pathname);
const indexProd = isProd
  ? fs.readFileSync(path.join(baseDir, 'dist/client/index.html'), 'utf-8')
  : '';

const app = express();

if (!isProd) {
  // Dev: use Vite's middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  app.use(vite.middlewares);
}

// Serve static assets from dist in prod
if (isProd) {
  app.use('/assets', express.static(path.join(baseDir, 'dist/client/assets')));
}

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl;
    let template, render;
    if (!isProd) {
      // Dev: load fresh template and SSR render each time
      template = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      ({ render } = await vite.ssrLoadModule('/src/entry-server.js'));
    } else {
      // Prod: use pre-built template and SSR bundle
      template = indexProd;
      render = (await import('./dist/server/entry-server.js')).render;
    }
    const appHtml = await render(url);
    const html = template
      .replace(`<!--app-html-->`, appHtml);
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e);
    res.status(500).end(e.message);
  }
});

