// router.js
import { createRouter as createVueRouter, createWebHistory, createMemoryHistory } from "vue-router";

import HomeView from "../pages/index.page.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { title: "Home" }
  },

  {
    path: "/news",
    name: "news",
    component: () => import("../pages/news.page.vue"),
    meta: { title: "News" }
  },

  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../pages/about.page.vue"),
    meta: { title: "About" }
  },
];

export function createRouter() {
  return createVueRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  });
};
